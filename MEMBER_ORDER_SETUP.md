# 멤버 순서 관리 기능 설정 가이드

## 현재 구현 상태
✅ **완료된 작업:**
1. 드래그 앤 드롭 UI 구현
2. localStorage를 사용한 순서 저장 (즉시 작동)
3. Supabase 데이터베이스 지원 준비 완료

## 작동 방식
현재 시스템은 **두 가지 방식**으로 작동합니다:

### 1. localStorage 방식 (현재 작동중)
- 브라우저의 localStorage에 멤버 순서를 저장
- 드래그 앤 드롭으로 즉시 순서 변경 가능
- 같은 브라우저에서는 순서가 유지됨
- **제한사항**: 다른 브라우저나 기기에서는 순서가 동기화되지 않음

### 2. 데이터베이스 방식 (설정 필요)
- Supabase 데이터베이스에 순서를 저장
- 모든 사용자에게 동일한 순서 표시
- 기기/브라우저 관계없이 순서 동기화

## 데이터베이스 설정 방법 (선택사항)

### 방법 1: Supabase Dashboard에서 직접 설정
1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. `supabase_migration.sql` 파일의 내용을 복사하여 실행
5. "Run" 버튼 클릭

### 방법 2: Table Editor 사용
1. Supabase Dashboard에서 **Table Editor** 선택
2. `members` 테이블 선택
3. "New Column" 클릭
4. 다음 정보 입력:
   - Name: `display_order`
   - Type: `int4`
   - Default Value: (비워두기)
   - Is Nullable: ✅ (체크)
5. Save

## 사용 방법

### 관리자 모드에서 순서 변경:
1. 관리자 모드 열기 (Ctrl+Shift+A)
2. "멤버" 탭 선택
3. 멤버 카드를 드래그하여 원하는 위치로 이동
4. 드롭하면 자동 저장

### 시각적 피드백:
- 드래그 중: 카드가 반투명하게 표시
- 드롭 위치: 주황색 테두리로 표시
- 드래그 핸들: 각 카드 왼쪽의 ≡ 아이콘

## 문제 해결

### 순서가 저장되지 않는 경우:
1. 브라우저 콘솔(F12)에서 오류 확인
2. localStorage 초기화:
   ```javascript
   localStorage.removeItem('memberOrder');
   location.reload();
   ```

### 다른 기기에서 순서가 다른 경우:
- 데이터베이스 설정을 완료하면 해결됩니다
- 임시 해결책: 관리자가 각 기기에서 수동으로 순서 조정

## 기술 정보
- **localStorage 키**: `memberOrder`
- **데이터 형식**: `{memberId: orderIndex}`
- **폴백 순서**: created_at (생성 시간)