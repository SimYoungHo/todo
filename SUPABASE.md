# Supabase 연동 및 인증 가이드

이 문서는 '심플 할 일 목록' 어플리케이션의 데이터를 Supabase로 이전하고, Email Auth를 연동하기 위한 가이드입니다.

## 1. Supabase 프로젝트 정보

현재 연동된 프로젝트의 정보입니다.

- **Project URL**: `https://ttplhgycytpdbtvldlqe.supabase.co`
- **API Key (anon public)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0cGxoZ3ljeXRwZGJ0dmxkbHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDQ3NTQsImV4cCI6MjA5NDc4MDc1NH0.ugY1yu1NsGrEONaa-TQesGRZPYOYIkMZgETZQsCv14s`

## 2. 이메일 인증 설정 (Dashboard)

1. **Authentication > Providers**: `Email` 공급자가 `Enabled` 상태인지 확인합니다.
2. **Authentication > Email Templates**: 
   - 테스트를 위해 `Confirm email` 설정을 끄는 것을 권장합니다 (`Authentication > Settings > Path: Email Confirmations`). 비활성화하면 가입 즉시 로그인이 가능합니다.

## 3. 데이터베이스 테이블 구조 업데이트 (SQL)

인증된 사용자만 본인의 데이터를 관리할 수 있도록 `user_id` 컬럼을 추가하고 RLS 정책을 강화해야 합니다.

```sql
-- 1. todos 테이블에 user_id 컬럼 추가 (auth.users 참조)
alter table todos 
add column user_id uuid references auth.users not null default auth.uid();

-- 2. 기존 RLS 정책 삭제
drop policy if exists "Allow public access" on todos;

-- 3. 새로운 RLS 정책 생성 (본인 데이터만 CRUD 가능)
alter table todos enable row level security;

create policy "Users can manage their own todos" 
on todos for all 
using (auth.uid() = user_id) 
with check (auth.uid() = user_id);
```

## 4. 구현 상세 (script.js)

- **인증 감시**: `client.auth.onAuthStateChange`를 사용하여 세션 유무에 따라 로그인 창과 할 일 목록 창을 전환합니다.
- **데이터 필터링**: `fetchTodos()` 요청 시 `.eq('user_id', currentUser.id)`를 사용하여 보안을 강화했습니다.
- **데이터 삽입**: 새로운 할 일 추가 시 `user_id: currentUser.id`를 명시적으로 포함합니다.

## 5. 확인 사항
- 브라우저 보안 정책으로 인해 `file://` 경로에서는 작동하지 않을 수 있습니다. 반드시 **로컬 서버(Live Server 등)**를 통해 실행하세요.
- `SQL Editor`에서 위 3번의 쿼리를 반드시 실행해야 정상적으로 데이터가 저장됩니다.
