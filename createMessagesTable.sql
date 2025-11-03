-- Messages 테이블 생성
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text DEFAULT '',
    message text NOT NULL,
    "isAnonymous" boolean DEFAULT false,
    reply text DEFAULT '',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 메시지를 읽을 수 있도록 허용
CREATE POLICY "Anyone can view messages" ON public.messages
    FOR SELECT USING (true);

-- 모든 사용자가 메시지를 삽입할 수 있도록 허용
CREATE POLICY "Anyone can insert messages" ON public.messages
    FOR INSERT WITH CHECK (true);

-- 관리자만 메시지를 업데이트할 수 있도록 허용 (답글 추가용)
-- 현재는 모든 사용자가 업데이트 가능하도록 설정 (추후 인증 시스템 구축 시 수정)
CREATE POLICY "Anyone can update messages" ON public.messages
    FOR UPDATE USING (true);

-- 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER handle_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();