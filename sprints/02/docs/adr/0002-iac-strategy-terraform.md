# ADR 0002: Infrastructure as Code (IaC) Stratégia - Terraform

**Dátum:** 2025-12-08
**Státusz:** Elfogadva
**Döntéshozók:** Tech Lead, DevOps
**Kontextus:** Sprint 2 - IaC követelmény

---

## Kontextus és Probléma

A Sprint 2 követelményei között szerepel egy működő IaC (Infrastructure as Code) megoldás, amely biztosítja:

1. **Reprodukálható környezetek:** Azonos konfiguráció dev/staging/prod között
2. **Verziókezelt infrastruktúra:** Git history az infrastruktúra változásokról
3. **Terraform validate + plan:** CI-ban automatikusan ellenőrzi a konfigurációt
4. **Dokumentált döntések:** Miért ezt a platformot választottuk?

**Kérdés:** Melyik IaC tool-t használjuk és mi legyen a stratégia az MVP fázisban?

**Korlátok:**
- MVP: Nem kell azonnal `apply` (deployment manuális maradhat egyelőre)
- Egyszerűség: Minimális konfiguráció, gyors setup
- Cost: Ingyenes tier eszközök preferáltak

---

## Döntés

**IaC Tool:** Terraform (HCL - HashiCorp Configuration Language)

**Stratégia:** Terraform `validate` + `plan` csak (apply későbbi sprint)

**Target Platform:** Vercel (CDN + Hosting) + GitHub (VCS)

**Reasoning:**

### 1. Miért Terraform?

- **Vendor-agnostic:** Multi-cloud (ha később AWS/GCP kell, ugyanaz a tool)
- **Declarative:** Mit akarunk (nem hogy), egyszerűbb mint imperatív (pl. Bash scriptek)
- **State management:** `terraform.tfstate` nyilvántartja az aktuális állapotot
- **Plan preview:** `terraform plan` előre mutatja a változásokat (dry-run)
- **Industry standard:** DevOps világban 80%+ használat

### 2. Miért validate + plan (nem apply)?

**MVP fázisban:**
- Vercel deployment: `git push` automatikusan deployal (GitHub integration)
- Manual apply: UI-ban könnyebb iterálni tesztelés közben
- Risk mitigation: Nem akarunk véletlenül törölni erőforrásokat script hibából

**Későbbi sprintekben:**
- Full `terraform apply` CI-ban
- Terraform Cloud/Backend remote state
- Multi-environment support (dev/staging/prod)

### 3. Miért Vercel Terraform Provider?

- **Official provider:** Vercel fenntartja ([vercel/terraform-provider-vercel](https://github.com/vercel/terraform-provider-vercel))
- **Project, domain, env vars kezelés:** Minden konfigurálható Terraform-ból
- **Preview deployments:** Automatikusan PR-ekhez (branch deployment)

---

## Alternatívák és Trade-off-ok

### Alternatíva 1: AWS CloudFormation

**Előnyök:**
- AWS natív, deep integration
- Free (csak az erőforrások után fizetünk)

**Hátrányok:**
- Vendor lock-in (csak AWS)
- YAML/JSON verbose szintaxis
- MVP-nél nem használunk AWS-t (Vercel simpler)

**Miért NEM választottuk:** Vercel-lel dolgozunk MVP-ben, nem AWS.

---

### Alternatíva 2: Pulumi

**Előnyök:**
- Modern (TypeScript/Python/Go támogatás)
- Programozható (if-else logic natívan)
- Jó developer experience

**Hátrányok:**
- Kisebb közösség mint Terraform
- State management komplexebb (Pulumi Cloud kell a free tier-hez)
- Kevesebb Vercel-specifikus dokumentáció

**Miért NEM választottuk:** Terraform érettebb, több dokumentáció, szélesebb support.

---

### Alternatíva 3: Ansible

**Előnyök:**
- Agentless (SSH alapú)
- Jó config management-hez (VM setup)

**Hátrányok:**
- Imperatív (playbook = "hogyan" nem "mit")
- State management gyengébb (idempotency de nincs state file)
- Cloud provider support korlátozott

**Miért NEM választottuk:** Terraform deklaratív modellje jobb infrastruktúra kódoláshoz.

---

### Alternatíva 4: Manual setup (UI + dokumentáció)

**Előnyök:**
- Egyszerű kezdésnek
- Nincs extra tooling

**Hátrányok:**
- Nem reprodukálható (kézzel kattintgatás)
- Nincs verziókezelés
- Ember hiba (elfelejtett lépés)
- Nem teljesíti Sprint 2 követelményt (IaC kötelező)

**Miért NEM választottuk:** Sprint requirement: IaC + terraform plan.

---

## Terraform Konfiguráció (MVP Minimális)

### Fájlstruktúra

```
infra/terraform/
├── main.tf              # Fő erőforrások (Vercel project, domain)
├── providers.tf         # Provider konfiguráció
├── variables.tf         # Input változók (pl. project_name)
├── outputs.tf           # Output értékek (pl. deployment URL)
├── terraform.tfvars     # Változók értékei (gitignore!)
├── .gitignore           # tfstate, tfvars ignorálása
└── README.md            # Setup és usage útmutató
```

### `providers.tf` (példa)

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
}
```

### `main.tf` (példa)

```hcl
resource "vercel_project" "parkvision_frontend" {
  name      = "parkvision-frontend"
  framework = "vite"

  git_repository = {
    type = "github"
    repo = "username/parkvision-frontend"
  }

  build_command    = "npm run build"
  output_directory = "dist"
}

resource "vercel_project_domain" "main" {
  project_id = vercel_project.parkvision_frontend.id
  domain     = "parkvision-mvp.vercel.app"
}
```

---

## CI/CD Integration

### GitHub Actions Workflow (`.github/workflows/terraform.yml`)

```yaml
name: Terraform Validate & Plan

on:
  pull_request:
    paths:
      - 'infra/terraform/**'
  push:
    branches:
      - main

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0

      - name: Terraform Init
        working-directory: infra/terraform
        run: terraform init

      - name: Terraform Validate
        working-directory: infra/terraform
        run: terraform validate

      - name: Terraform Plan
        working-directory: infra/terraform
        env:
          VERCEL_API_TOKEN: ${{ secrets.VERCEL_API_TOKEN }}
        run: terraform plan -out=plan.out

      - name: Upload Plan Artifact
        uses: actions/upload-artifact@v3
        with:
          name: terraform-plan
          path: infra/terraform/plan.out
```

**Eredmény:** Minden PR-nél és push-nál ellenőrzi, hogy a Terraform kód valid-e és milyen változásokat okozna.

---

## Következmények

### Pozitív

 **Reprodukálhatóság:** `terraform plan` mindig ugyanazt az infrastruktúrát írja le
 **Verziókezelés:** Git history mutatja az infra változásokat
 **CI validation:** Automatikus ellenőrzés, kevesebb hibás konfig
 **Dokumentáció:** Terraform fájlok önmagukban dokumentálják az infrastruktúrát
 **Multi-cloud ready:** Későbbi AWS/GCP integráció egyszerű (pl. S3 backup)

### Negatív / Kockázatok

[!] **State file kezelés:** `terraform.tfstate` sensitive (API tokenek hash-ei). **Mitigáció:** `.gitignore`-ban, később Terraform Cloud remote state.

[!] **Vercel provider frissítések:** Breaking change-ek a provider verziófrissítéskor. **Mitigáció:** Version pinning (`~> 0.15`), changelog review frissítés előtt.

[!] **Apply manual:** Jelenleg a `terraform apply`-t manuálisan kell futtatni, nincs auto-deployment. **Mitigáció:** Vercel UI deployment átmeneti, Sprint 3-ban auto apply.

[!] **Learning curve:** Csapatnak Terraform HCL syntax tanulás. **Mitigáció:** Egyszerű MVP konfig, dokumentált példák.

---

## Implementációs Lépések

1. **Terraform telepítés:**
   ```bash
   # macOS
   brew install terraform

   # Linux
   wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
   unzip terraform_1.5.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   ```

2. **Vercel API token generálás:**
   - Vercel Dashboard → Settings → Tokens
   - Create token (scope: Full Access)
   - Mentés `.env` fájlba (gitignore!)

3. **Terraform init:**
   ```bash
   cd infra/terraform
   terraform init  # Provider letöltés
   ```

4. **Validate + Plan:**
   ```bash
   terraform validate  # Syntax check
   terraform plan      # Dry-run
   ```

5. **CI integration:**
   - GitHub Secrets: `VERCEL_API_TOKEN` hozzáadása
   - Workflow fájl push → CI fut

---

## Sikerkritériumok

- [x] `terraform validate` sikeres (0 error)
- [x] `terraform plan` sikeres (generál `plan.out` fájlt)
- [x] `plan.out` artifact elérhető CI-ban
- [x] README.md tartalmaz setup utasításokat
- [x] `.gitignore` tartalmazza `*.tfstate`, `*.tfvars`

---

## Kapcsolódó Döntések

- **ADR 0001:** Vercel platform választás (ez indokolja a Vercel Terraform provider-t)
- **NFR-07:** IaC validáció kötelező (CI check)

---

## Referenciák

- [Terraform Official Docs](https://www.terraform.io/docs)
- [Vercel Terraform Provider](https://registry.terraform.io/providers/vercel/vercel/latest/docs)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)

---

## Changelog

- 2025-12-08: v1.0 - ADR létrehozva (validate + plan stratégia)

---

**Státusz:**  Implementálva

**Következő lépés (Sprint 3):** Full `terraform apply` automatizálás CI-ban, remote state (Terraform Cloud).
