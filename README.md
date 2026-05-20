# 심플 할 일 목록 (Simple Todo List)

이 프로젝트는 Supabase를 활용한 심플한 할 일 목록 관리 애플리케이션입니다.

## 주요 기능
- **회원가입 및 로그인**: 이메일/비밀번호 기반 인증.
- **소셜 로그인**: Google 및 GitHub 간편 로그인 지원.
- **할 일 관리**: 할 일 추가, 상태 토글(완료/미완료), 삭제 기능.
- **개인별 데이터**: 사용자별 데이터 격리(RLS 정책 적용).

## 기술 스택
- Frontend: HTML5, Vanilla JavaScript, CSS3
- Backend/DB: Supabase (Auth, PostgreSQL)

## 시작하기

### 1. 환경 설정
브라우저 보안 정책상 로컬 파일(`file://`)에서는 인증이 동작하지 않습니다. 반드시 **Live Server**나 간단한 로컬 HTTP 서버를 통해 실행하세요.

### 2. Supabase 연동
Supabase 대시보드에서 다음 설정이 필요합니다:
- **Authentication**: Email 공급자 및 소셜 로그인(Google, GitHub) 공급자를 `Enabled`로 설정합니다.
- **Database (SQL)**: `todos` 테이블에 `user_id` 컬럼을 추가하고 RLS 정책을 설정해야 합니다 (SUPABASE.md 참고).

### 3. 소셜 로그인 설정
1. 각 공급자(Google Cloud Console, GitHub Developer Settings)에서 OAuth App을 생성합니다.
2. Supabase 대시보드의 **Authentication > Providers**에서 제공하는 **Callback URL**을 해당 공급자의 리디렉션 URI에 등록합니다.
3. 발급받은 `Client ID`와 `Client Secret`을 Supabase 설정에 입력합니다.

## 디렉토리 구조
- `index.html`: 메인 UI 및 로그인 폼.
- `script.js`: Supabase 클라이언트 설정 및 인증/데이터 로직.
- `style.css`: 애플리케이션 스타일.
- `SUPABASE.md`: DB 구조 및 인증 상세 가이드.
