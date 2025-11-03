const fs = require('fs');
const path = require('path');

const sourceDir = '/home/julyw/school/member';
const targetDir = '/home/julyw/school/school-project/public';

console.log('이미지 동기화 시작...');

try {
  // member 폴더의 파일 목록 읽기
  const files = fs.readdirSync(sourceDir);
  
  // 이미지 파일만 필터링
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
  });
  
  console.log(`${imageFiles.length}개의 이미지 파일 발견`);
  
  // 각 이미지 파일 복사
  imageFiles.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    // 파일이 이미 존재하는지 확인
    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ ${file} 복사 완료`);
    } else {
      console.log(`⏭️  ${file} 이미 존재함`);
    }
  });
  
  console.log('이미지 동기화 완료!');
} catch (error) {
  console.error('오류 발생:', error);
}