# 🛠️ Paper-summarizer Frontend Repository

---
## 🚀목차
- [진행 현황](#진행-현황-progress)
- [개발 사이클](#-개발-사이클-development-workflow)
- [Git 커밋 메시지 컨벤션](#-git-커밋-메시지-컨벤션)
---
## 📆진행 현황 (Progress)
| 기능                  | 상태 | 설명                                      |
|---------------------|------|-----------------------------------------|
 | 프로젝트 세팅|✅ 완료|  |
| Vercel 자동 배포 | ✅ 완료 | GitHub Actions + Vercel 환경          |
 | 폴더 구조 세팅 | ✅ 완료 |                    |
 | 기능 구현 | ✅ 완료 |                    |

> 🟡 : 개발 중 / ⏳ : 예정 / ✅ : 완료
---

## 🔄 개발 사이클 (Development Workflow)

이 프로젝트는 **GitHub Flow**를 기반으로 하며, 다음과 같은 절차로 개발을 진행합니다:

### 📌 브랜치 전략

| 브랜치명              | 용도 |
|-------------------|------|
| `main`            | 운영 배포용 (배포되는 안정 버전) |
| `dev`             | 개발용 통합 브랜치 |
| `feature/(기능명)` | 기능 개발 브랜치 (`feature/login` 등) |


---

### 👨‍💻 기능 개발 절차

```bash
# 1. dev에서 기능 브랜치 생성
git switch dev
git pull origin dev
git switch -c feature/login  # 기능명 기준

# 2. 코드 작성 & 커밋
git add .
git commit -m "feat: 로그인 컴포넌트 구현" # 기능명 기준

# 3. 원격 브랜치 푸시
git push origin feature/login

# 4. GitHub에서 PR 생성 → 대상 브랜치: dev
```

> **PR 제목 예시:**  
> `feat: 로그인 컴포넌트 구현`  
> `fix: 회원가입 이메일 유효성 검사 멘트 수정`

---


### 🧼 브랜치 정리

- PR 병합 완료 후, `feature/*` 브랜치는 **삭제**
- `dev` 브랜치에 병합
- `main` 브랜치는 항상 **배포 가능한 상태 유지**

---

## 🔐 Git 커밋 메시지 컨벤션

| 태그 | 설명 |
|------|------|
| `add` | 새로운 파일 추가 |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `refactor` | 리팩토링 |
| `test` | 테스트 추가 |
| `chore` | 빌드, 설정 관련 작업 |

> 예시:  
> feat: 회원가입 기능 구현`  
> fix: 로그인시 에러메시지 수정`
