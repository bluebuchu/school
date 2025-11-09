# Supabase Storage 설정 가이드

## 1. Storage 버킷 생성

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Storage** 클릭
4. **New bucket** 버튼 클릭
5. 다음 설정으로 버킷 생성:
   - **Bucket name**: `member-images`
   - **Public bucket**: ✅ 체크 (필수!)
   - **File size limit**: `10485760` (10MB)
   - **Allowed MIME types**: `image/png,image/jpeg,image/jpg,image/webp`

## 2. 버킷 정책 설정 (RLS)

Storage > Policies 탭에서 다음 정책 추가:

### 읽기 정책 (모든 사용자)
```sql
-- Policy name: Public read access
-- Allowed operation: SELECT
-- Target roles: anon, authenticated

CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'member-images');
```

### 업로드 정책 (모든 사용자)
```sql
-- Policy name: Public upload access  
-- Allowed operation: INSERT
-- Target roles: anon, authenticated

CREATE POLICY "Public upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'member-images');
```

## 3. (선택사항) Service Role Key 설정

더 강력한 권한이 필요한 경우:

1. Supabase 대시보드 > Settings > API
2. Service Role Key 복사
3. `.env.local` 파일에 추가:
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **주의**: Service Role Key는 서버 사이드에서만 사용해야 하며, 절대 클라이언트에 노출되면 안 됩니다!

## 4. 테스트 방법

1. 브라우저에서 `localhost:3000` 접속
2. `Ctrl+Shift+A`로 관리자 모드 진입
3. **멤버 관리** 탭 선택
4. **🖼️ 새 이미지 업로드** 버튼 클릭
5. 이미지 파일 선택 (최대 10MB)
6. 업로드 성공 메시지 확인

## 문제 해결

### "Storage bucket not found" 오류
→ 버킷 이름이 정확히 `member-images`인지 확인

### "Storage access denied" 오류
→ 버킷이 Public으로 설정되었는지 확인
→ RLS 정책이 올바르게 설정되었는지 확인

### 업로드는 되는데 이미지가 안 보임
→ 버킷이 Public으로 설정되었는지 확인
→ 읽기 정책(SELECT)이 설정되었는지 확인

## 지원 파일 형식
- PNG (.png)
- JPEG/JPG (.jpeg, .jpg)  
- WebP (.webp)

## 파일 크기 제한
- 최대 10MB

## 보안 고려사항
- 파일명에 타임스탬프 자동 추가 (중복 방지)
- 특수문자 자동 제거 (보안)
- MIME 타입 검증 (이미지만 허용)
- 파일 크기 제한 (서버 보호)