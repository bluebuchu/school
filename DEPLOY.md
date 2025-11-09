# 배포 가이드

## 🚀 Vercel로 자동 배포하기

### 1. Vercel 연동
1. [vercel.com](https://vercel.com) 접속
2. **"Continue with GitHub"**로 로그인
3. **"New Project"** 클릭
4. **"Import Git Repository"** 선택
5. `bluebuchu/school` 저장소를 찾아서 **"Import"** 클릭

### 2. 프로젝트 설정
- **Project Name**: `school-app` (원하는 이름)
- **Framework**: `Next.js` (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)

### 3. 환경변수 설정 (중요!)
배포 전 또는 후 **Settings → Environment Variables**에서 추가:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

⚠️ **환경변수 설정 후 재배포 필요**: Redeploy 버튼 클릭

### 4. Supabase Storage 설정
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. **Storage** → **New Bucket** 클릭
3. 설정:
   - Name: `member-images`
   - Public: ✅ 체크
   - File size limit: 10MB
   - Allowed MIME types: `image/*`
4. **Create** 클릭

### 4. 배포 완료! 🎉
- 이후 main 브랜치에 push할 때마다 자동 재배포
- 배포 URL: `https://school-app-xxx.vercel.app`

## 📝 수동 배포 (CLI)
```bash
# Vercel CLI 로그인
npx vercel login

# 첫 배포
npx vercel --prod

# 이후 배포
npx vercel --prod
```

## 🔧 환경변수 로컬 설정
`.env.local` 파일 생성:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```