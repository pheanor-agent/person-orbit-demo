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
| 펠리컨 · 자전거 | https://pheanor-agent.github.io/person-orbit-demo/?model=pelican |

## 피카츄 비교 샘플

GPT-6.1 Sol과 GPT-6 Astra가 공식 외형 참고와 같은 16초 동작 구성을 바탕으로 각각 Blender에서 모델과 애니메이션을 제작했습니다. 탐색 → 네 걸음 → 점프·착지 → 손 흔들기 → 복귀를 반복합니다. 파일은 Blender에서 작성한 팬 모델이며 공식 Pokémon 3D 자산이 아닙니다. 공식 TV Tokyo XY&Z 캐릭터 그림과 실제 애니메이션 장면을 참고해 얼굴·체형·귀·손발을 다듬었습니다. 공개 데모는 밝은 배경, 셀 음영과 얇은 윤곽선을 사용합니다. 세부 제작·검증 결과는 JOB-4169 및 프로젝트 어셋별 기록을 참조합니다.

## 원본 기준 야구 디테일 비교

최초 입력 원본 이미지를 기준으로 네 가지 방식을 비교합니다. 각 모델을 선택하면 같은 뷰어에서 정면·측면·후면과 360° 회전을 확인할 수 있습니다. 페이지의 원본 이미지 보기와 GLB 다운로드도 함께 제공합니다.

| 방식 | 개별 모델 주소 | 작업 |
|---|---|---|
| 형상 보정 | [바로 열기](https://pheanor-agent.github.io/person-orbit-demo/?model=baseball-geometry) | Blender에서 기존 메시의 공 실밥·장갑 봉제선 세부를 추가 |
| 원본 이미지 투영 | [바로 열기](https://pheanor-agent.github.io/person-orbit-demo/?model=baseball-projection) | 정합되는 부분의 색·무늬를 원본에서 투영하고 4096 UV 텍스처로 베이크 |
| 고해상도 + 공 보정 | [바로 열기](https://pheanor-agent.github.io/person-orbit-demo/?model=baseball-hires) | 원본으로 TRELLIS.2 1536_cascade 재생성 후 Blender에서 공·실밥·배트 접촉 보정 |
| AI 재질 보정 | [바로 열기](https://pheanor-agent.github.io/person-orbit-demo/?model=baseball-retexture) | 기존 메시를 조건으로 TRELLIS.2 텍스처 재생성 후 천·피부·목재의 비금속 PBR 설정 교정 |

기존 야구 모델은 알파 배경과 공 위치를 교정한 이미지로 생성됐습니다. 이번 비교의 기준은 최초 원본이며, 단일 사진에 보이지 않는 뒷면과 손가락 등은 추정입니다. 형상·투영·재질 방식은 기존 자세를 유지하므로 원본의 모든 형태를 재현하지 않습니다. 고해상도 재생성도 자동 생성 후 공을 수동 보정한 혼합 방식입니다. 정적 메시이며 스윙 애니메이션은 없습니다. 세부 제작 근거는 JOB-4172와 각 로컬 어셋의 provenance/docs에 있습니다.

고해상도 보정본은 공 주변의 어두운 생성 흔적이 남습니다. AI 재질본은 기존 공 위치를 유지하고 실밥이 흐립니다. 모든 방식이 원본의 세부를 똑같이 개선하는 것은 아니므로 같은 각도에서 비교해 선택하세요.

## 펠리컨 · 자전거

[바로 열기](https://pheanor-agent.github.io/person-orbit-demo/?model=pelican) · [GLB 다운로드](https://pheanor-agent.github.io/person-orbit-demo/assets/pelican-bicycle.glb). 원래 WebGL 장면의 펠리컨과 자전거 형상을 Blender에서 animated GLB로 재구성했습니다. 4초 루프에 다리 IK, 페달 2회전, 바퀴 5회전을 베이크했으며 공통 애니메이션 재생·일시정지·타임라인·속도 제어를 사용합니다. 바닥·도로·카메라·조명은 GLB에 포함하지 않았습니다. 제작 소스와 한계는 JOB-4180 및 어셋 기록에 있습니다.

## 펼친 모델 목록과 360° 배경

모델은 항상 보이는 버튼 목록에서 선택합니다. 야구 타격 샘플 5종과 피카츄 2종은 접고 펼칠 수 있는 그룹으로 묶었습니다. `어셋에 맞춤 · 자동`이 기본 모드이며 Cesium Man→도시 안뜰, T형 기계→기계 작업장, 후드 여행자→숲길, 야구 5종→경기장, 피카츄 Sol/Astra→햇살 초원, 펠리컨→포장 시골길을 적용합니다. 모델을 바꿀 때 자동 모드만 추천 배경으로 따라가며, 배경을 직접 선택하면 모델을 바꿔도 유지됩니다. `자동`을 누르면 현재 모델 추천으로 돌아옵니다. 단색 스튜디오도 수동 선택으로 제공됩니다.

`?model=...&background=...` 조합은 모델/배경 링크 복사, 비교 링크, 브라우저 뒤로·앞으로 및 직접 재진입에 유지됩니다. `background`를 생략하거나 `background=auto`이면 자동 모드이며, `background=default`는 수동 단색입니다. 도시 안뜰·기계 작업장·숲길·경기장·햇살 초원·호숫가 부두·포장 시골길 외에 가을 공원도 수동으로 선택할 수 있습니다. 파노라마 JPG는 Three.js equirectangular 매핑이며 카메라 드래그로 계속 회전할 수 있습니다. 야구에는 야구 전용 구장이 아닌 일반 경기장 파노라마를 사용합니다. 파노라마가 실제 적용된 동안 뷰어의 바닥 원판·grid·ring은 숨기며 GLB 형상에는 변경을 가하지 않습니다. 단색 스튜디오로 돌아오면 원판을 다시 표시합니다.

Poly Haven의 CC0 원본은 공식 tonemapped JPG를 4096×2048로 축소해 `assets/backgrounds/`에 포함했습니다. 출처 URL, CC0, 가공 내역, 경로와 SHA-256은 [`assets/backgrounds/catalog.json`](assets/backgrounds/catalog.json)에 있습니다. meadow_2의 8K tonemapped JPG가 제공되어 HDR tone-map이나 대체 이미지 없이 사용했습니다. 상세 고지는 `THIRD-PARTY-NOTICES.md`를 확인하세요.
