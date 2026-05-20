# 배포 가이드 (Deployment Guide)

이 문서는 '심플 할 일 목록' 어플리케이션을 외부에서 접속 가능하도록 배포하는 방법을 안내합니다.

## 1. 정적 웹 사이트 호스팅 추천
이 앱은 별도의 백엔드 서버가 없는 프론트엔드 프로젝트이므로, 정적 호스팅 서비스를 사용하는 것이 가장 빠르고 간편합니다.

- **Vercel** (추천): GitHub 레포지토리를 연동하면 자동으로 배포됩니다.
- **Netlify**: 드래그 앤 드롭으로 즉시 배포 가능합니다.
- **GitHub Pages**: 프로젝트 설정에서 `Pages` 메뉴를 통해 무료로 호스팅할 수 있습니다.

## 2. Vercel을 이용한 자동 배포 절차 (가장 추천)
1. **GitHub 저장소 생성**: 프로젝트 폴더를 GitHub에 업로드합니다.
2. **Vercel 회원가입**: [Vercel](https://vercel.com/)에 GitHub 계정으로 가입합니다.
3. **프로젝트 연동**:
   - `Add New Project`를 클릭합니다.
   - GitHub 저장소를 선택합니다 (`Import`).
4. **환경 설정**:
   - 특별한 빌드 설정이 필요 없으므로 그대로 `Deploy` 버튼을 누릅니다.
5. **완료**: 배포가 완료되면 Vercel에서 제공하는 도메인 주소(예: `todo-app.vercel.app`)로 접속할 수 있습니다.

## 3. 배포 전 필수 확인 사항
배포 후 Supabase 연동이 정상적으로 작동하려면 반드시 다음을 확인하세요.

### 1) URL 허용 (Site URL)
Supabase는 보안을 위해 등록된 도메인에서의 요청만 허용할 수 있습니다.
- **경로**: `Authentication` > `URL Configuration` > `Site URL`
- **설정**: 배포될 주소(예: `https://todo-app.vercel.app`)를 입력하고 저장하세요.

### 2) API 키 노출 주의
현재는 클라이언트 코드(`script.js`)에 API 키가 포함되어 있습니다. 공용 키(anon public key)이므로 정적 호스팅 환경에서는 사용 가능하지만, 더 안전하게 관리하려면 다음을 고려하세요:
- **환경 변수 사용**: Vercel의 `Environment Variables` 기능을 통해 키를 관리할 수 있습니다. (필요 시 `process.env` 사용)

## 4. 문제 해결 (Troubleshooting)
- **로그인이 안 돼요**: 배포된 주소가 `Site URL`에 등록되어 있는지 확인하세요.
- **데이터가 안 불러와져요**: `SUPABASE.md`에 기재된 RLS 정책이 배포 환경에서도 동일하게 적용되어 있는지 확인하세요.
