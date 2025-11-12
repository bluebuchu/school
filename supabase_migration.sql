-- Supabase SQL Editor에서 실행해주세요
-- 이 SQL을 Supabase Dashboard > SQL Editor에서 실행하면 display_order 컬럼이 추가됩니다.

-- 1. members 테이블에 display_order 컬럼 추가
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- 2. 기존 멤버들에게 순서 할당 (created_at 기준)
WITH ordered_members AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as new_order
  FROM members
  WHERE display_order IS NULL
)
UPDATE members 
SET display_order = ordered_members.new_order
FROM ordered_members
WHERE members.id = ordered_members.id;

-- 3. 향후 추가되는 멤버를 위한 기본값 설정 (선택사항)
-- 새로 추가되는 멤버는 가장 마지막 순서로 자동 설정
CREATE OR REPLACE FUNCTION set_display_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.display_order IS NULL THEN
    SELECT COALESCE(MAX(display_order), -1) + 1 INTO NEW.display_order
    FROM members;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_display_order_trigger
BEFORE INSERT ON members
FOR EACH ROW
EXECUTE FUNCTION set_display_order();