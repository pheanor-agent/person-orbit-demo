# ORBIT — 움직이는 3D 모델 감상 데모

## 실행
[GitHub Pages에서 데모 열기](https://pheanor-agent.github.io/person-orbit-demo/). 별도 설치 없이 브라우저에서 실행됩니다. Three.js r180과 기본 GLB 샘플이 HTML 안에 포함되어 있습니다.

## 조작
- 뷰포트 드래그(터치 가능): 모델 주위 카메라 회전
- 마우스 휠 또는 두 손가락 핀치: 확대/축소
- 자동 회전 시작/멈춤: 일정한 속도로 수평 회전
- 시점 초기화: 정면 기본 구도 복구 및 자동 회전 정지
- 정면/측면/후면: 빠른 기준 시점 선택
- 테스트 모델 프리셋: 기본 Cesium Man, 피카츄 Sol/Astra, TRELLIS.2로 로컬 생성한 T형 기계, 단일 입력 이미지에서 생성한 후드 여행자, 또는 야구 타격 순간 샘플 선택 (생성 프리셋은 페이지에서 GLB를 내려받음)
- 각 샘플은 `?model=<ID>` 주소로 바로 열 수 있으며 선택하면 주소와 바로 열기 링크가 함께 갱신됩니다.
- 링크 복사: 현재 샘플의 주소를 복사합니다.
- 애니메이션: 일시정지/재생, 처음부터, 재생 위치 이동, 0.5×/1×/1.5× 속도 조절. 카메라 회전과 동작 재생은 독립적입니다.

## 범위와 제약
기본 대상은 Cesium Man 샘플 3D 모델이며, 인물 오브젝트를 고정한 채 카메라가 주변을 회전합니다. 테스트 프리셋에는 TRELLIS.2 생성 T형 기계, 후드 여행자, 야구 타격 순간 GLB가 포함됩니다. 인물 샘플은 입력 이미지 한 장으로 추정한 결과로, 원본 신원·정확한 뒷모습·완전한 인체 해부학·리깅을 보장하지 않습니다. 샘플에 포함된 스킨 애니메이션은 재생될 수 있습니다. 일반 2D 사진을 3D로 생성·복원하는 기능은 포함되지 않습니다. 공개 페이지는 등록된 샘플 감상용이며 로컬 파일 업로드 메뉴는 제공하지 않습니다. GLB의 외부 URL 자산이나 사용자 브라우저가 허용하지 않는 WebGL 환경에서는 모델을 표시하지 못할 수 있습니다.

## 검증 및 라이선스
원본 데모는 Chromium 148에서 WebGL 렌더링, 드래그 360° 회전, 정면/측면/후면, 휠 줌, 자동 회전, 리셋, GLB 교체를 검증했습니다. TRELLIS.2 프리셋은 생성 자산별로 UI 선택·렌더링·카메라 이동을 검증합니다. Cesium Man의 CC BY 4.0은 해당 기본 샘플에만 해당하며 TRELLIS.2 생성 샘플에 자동 적용되지 않습니다. 생성 샘플의 별도 이용 조건이나 상업적 이용 권리를 보증하지 않습니다. 제3자 고지 전문은 `THIRD-PARTY-NOTICES.md`에 있습니다.

## 야구 타격 순간 프리셋

[야구 모델 바로 열기](https://pheanor-agent.github.io/person-orbit-demo/?model=baseball). 모델 선택 메뉴에서도 `TRELLIS.2 · 야구 타격 순간`을 선택할 수 있습니다. [GLB 다운로드](https://pheanor-agent.github.io/person-orbit-demo/assets/baseball-impact.glb).

ChatGPT에서 생성하고 알파 배경을 보정한 입력 이미지 한 장으로 로컬 TRELLIS.2에서 생성했습니다. `1024_cascade`, seed 42, 삼각형 목표 100,000, 텍스처 2048 설정이며 실제 삼각형은 99,694개입니다. 타자·배트·공을 포함한 정적 메시이며 뼈대나 스윙 애니메이션은 없습니다. 손가락·장갑·공 실밥의 세부와 뒷모습은 추정 결과입니다. 카메라 자동 회전과 모델 자체의 움직임은 별개입니다.

## 샘플 직접 주소

| 샘플 | 주소 |
|---|---|
| Cesium Man | https://pheanor-agent.github.io/person-orbit-demo/?model=cesium |
| T형 기계 | https://pheanor-agent.github.io/person-orbit-demo/?model=trellis |
| 후드 여행자 | https://pheanor-agent.github.io/person-orbit-demo/?model=person |
| 야구 타격 순간 | https://pheanor-agent.github.io/person-orbit-demo/?model=baseball |
| 피카츄 · Sol | https://pheanor-agent.github.io/person-orbit-demo/?model=pikachu-sol |
| 피카츄 · Astra | https://pheanor-agent.github.io/person-orbit-demo/?model=pikachu-astra |

## 피카츄 비교 샘플

GPT-6.1 Sol과 GPT-6 Astra가 공식 외형 참고와 같은 16초 동작 구성을 바탕으로 각각 Blender에서 모델과 애니메이션을 제작했습니다. 탐색 → 네 걸음 → 점프·착지 → 손 흔들기 → 복귀를 반복합니다. 파일은 Blender에서 작성한 팬 모델이며 공식 Pokémon 3D 자산이 아닙니다. 세부 제작·검증 결과는 JOB-4168 및 프로젝트 어셋별 기록을 참조합니다.
