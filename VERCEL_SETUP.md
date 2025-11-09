# Vercel 배포 환경변수 설정 가이드

## 🚀 현재 상태
- ✅ 로컬 환경에서 이미지 업로드 성공
- ❌ Vercel 웹사이트에서 환경변수 없음

## 📋 Vercel 환경변수 설정 방법

### 방법 1: Vercel 대시보드 (추천)

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트: `school-winds-projects-ad0b0c9a` 선택

2. **환경변수 추가**
   - **Settings** 탭 → **Environment Variables**
   - **Add** 버튼 클릭

3. **첫 번째 변수 추가**
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://aoxqondsiaopkuwohkvs.supabase.co
   Environment: Production ✅ Preview ✅ Development ✅
   ```

4. **두 번째 변수 추가**
   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFveHFvbmRzaWFvcGt1d29oa3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNDgyNTgsImV4cCI6MjA3NzYyNDI1OH0.4r7e8anNNkbnsPvXF_1Ihymztf6zniJMrGRnbILrkFA
   Environment: Production ✅ Preview ✅ Development ✅
   ```

5. **재배포**
   - **Deployments** 탭으로 이동
   - 최신 배포 옆 **...** → **Redeploy** 클릭

### 방법 2: GitHub를 통한 자동 설정

1. `.env.example` 파일이 생성되었음 (이미 완료)
2. Git에 커밋 및 푸시:
   ```bash
   git add .env.example
   git commit -m "Add environment variables template"
   git push
   ```
3. Vercel이 자동으로 환경변수 감지

## 🧪 테스트 방법

환경변수 설정 후:

1. **웹사이트 접속**: https://school-winds-projects-ad0b0c9a.vercel.app
2. **환경변수 확인**: `/api/check-env` 페이지 접속
3. **이미지 업로드 테스트**:
   - Ctrl+Shift+A → 관리자 모드
   - 멤버 관리 → 이미지 업로드

## 🔍 문제 해결

### "환경변수 없음" 오류
- Vercel 대시보드에서 환경변수 재확인
- 모든 환경(Production, Preview, Development) 체크 확인
- 재배포 완료 확인

### "Supabase 연결 실패"
- URL과 Key가 정확한지 확인
- Supabase 프로젝트 활성화 상태 확인

## 📝 참고사항

- **환경변수 변경 시**: 반드시 재배포 필요
- **보안**: .env.local은 Git에 포함되지 않음 (정상)
- **Public Key**: NEXT_PUBLIC_으로 시작하는 키는 클라이언트에서 접근 가능