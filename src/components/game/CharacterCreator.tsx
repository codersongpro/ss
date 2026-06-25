import React, { useState } from 'react';
import type { PlayerInfo } from '@/game/types';
import { User, Award, ShieldAlert, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface CharacterCreatorProps {
  onBackToTitle: () => void;
  onComplete: (info: PlayerInfo) => void;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onBackToTitle, onComplete }) => {
  const [step, setStep] = useState(1);

  // 캐릭터 기본 폼 상태
  const [name, setName] = useState('');
  const [experience, setExperience] = useState<PlayerInfo['experience']>('newbie');
  const [grade, setGrade] = useState<number>(3);
  const [isClassTeacher, setIsClassTeacher] = useState<boolean>(true);
  const [familyState, setFamilyState] = useState<PlayerInfo['familyState']>('single');
  const [commuteDistance, setCommuteDistance] = useState<PlayerInfo['commuteDistance']>('medium');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [schoolType, setSchoolType] = useState<string>('도심 대규모 학교');
  const [difficulty, setDifficulty] = useState<PlayerInfo['difficulty']>('realistic');

  // 특성 사전 정의
  const availableTraits = [
    { name: '수업 장인', desc: '수업 전문성 보너스 획득, 수업 효과 향상', penalty: '공동 업무 분담 피로도 약간 증가' },
    { name: '공감형 교사', desc: '학생 신뢰 및 학부모 신뢰 대폭 향상', penalty: '사건 발생 시 감정 소모(멘탈 차감) 가중' },
    { name: '행정 해결사', desc: '기본 행정 역량 보너스, 공문 처리 효율 향상', penalty: '추가 행정 기안 빈도 약간 증가' },
    { name: '칼퇴 수호자', desc: '정시 퇴근 시 체력 및 가정 만족도 대폭 회복', penalty: '야근 기피로 인한 관리자 신뢰 획득 패널티' },
    { name: '원칙주의자', desc: '공정성 플래그 및 교장/교감 신뢰 보너스', penalty: '유연한 관계 해결 시 난이도 상승' },
    { name: '교사력왕', desc: '하루 최대 교사력(TP) +1 보너스', penalty: '초기 수업 전문성 보너스 전무' }
  ];

  // 학교 유형 정의
  const schoolTypes = [
    { name: '도심 대규모 학교', desc: '학생 수와 잡무가 폭발하며, 교직원 간 파벌이 존재합니다. (난이도: 중)' },
    { name: '신도시 학교', desc: '신축 건물에 쾌적하지만 학부모들의 교육 열의와 민원 수준이 극도로 높습니다. (난이도: 상)' },
    { name: '농산촌 소규모 학교', desc: '전교생이 적어 밀접하지만 교사 1명이 5개 이상의 다중 행정 부서를 담당합니다. (난이도: 최상)' }
  ];

  // 특성 토글 헬퍼
  const handleToggleTrait = (traitName: string) => {
    if (selectedTraits.includes(traitName)) {
      setSelectedTraits(selectedTraits.filter(t => t !== traitName));
    } else {
      if (selectedTraits.length >= 2) {
        // 이미 2개 선택됨
        alert('특성은 최대 2개까지만 선택할 수 있습니다.');
        return;
      }
      setSelectedTraits([...selectedTraits, traitName]);
    }
  };

  // 다음 단계 가기
  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      alert('교사 이름 또는 별명을 입력해 주세요.');
      return;
    }
    if (step === 2 && selectedTraits.length !== 2) {
      alert('자신을 상징할 초기 특성을 반드시 2개 선택해 주세요.');
      return;
    }
    setStep(prev => prev + 1);
  };

  // 이전 단계 가기
  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  // 최종 부임하기 실행
  const handleComplete = () => {
    const finalInfo: PlayerInfo = {
      name,
      experience,
      grade,
      isClassTeacher,
      familyState,
      commuteDistance,
      traits: selectedTraits,
      schoolType,
      difficulty
    };
    onComplete(finalInfo);
  };

  return (
    <div className="min-height-screen flex flex-col items-center justify-center p-4 bg-[#FAF8F5] transition-all duration-300" style={{ minHeight: '100vh' }}>
      <div className="max-w-2xl w-full paper-card bg-white relative">
        {/* 장식용 포스트잇 선 */}
        <div className="absolute top-0 left-12 w-8 h-4 bg-amber-200/50 -translate-y-2 border border-black/10 rotate-3" />
        
        {/* 상단 진행 단계 인디케이터 */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-900">
          <h2 className="text-2xl font-bold font-school flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-600" />
            신임 교사 인사기록카드 작성
          </h2>
          <div className="text-sm font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            단계 {step} / 3
          </div>
        </div>

        {/* 1단계: 기본 신상 정보 */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
              <p className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                보안 주의: 원활한 보안과 개인정보보호를 위해 실제 성함, 실제 학년, 실존 학교명은 절대 기재하지 마십시오.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">교사 이름 (또는 별칭) *</label>
              <input
                type="text"
                placeholder="예: 김선생, 박교사"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={10}
                className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">교직 경력</label>
                <select
                  value={experience}
                  onChange={e => setExperience(e.target.value as PlayerInfo['experience'])}
                  className="w-full border-2 border-black rounded-xl p-3 bg-white font-medium focus:outline-none"
                >
                  <option value="newbie">신규 임용 교사 (초심)</option>
                  <option value="junior">3 ~ 5년 차 (주니어)</option>
                  <option value="senior">10년 차 이상 (시니어)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">담당 학년</label>
                <select
                  value={grade}
                  onChange={e => setGrade(Number(e.target.value))}
                  className="w-full border-2 border-black rounded-xl p-3 bg-white font-medium focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(g => (
                    <option key={g} value={g}>{g}학년</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">담임 임명</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsClassTeacher(true)}
                  className={`flex-1 p-3 border-2 rounded-xl font-bold transition-all ${
                    isClassTeacher ? 'bg-emerald-500 text-white border-black shadow-school-press' : 'bg-slate-50 border-black hover:bg-slate-100'
                  }`}
                >
                  학급 담임 교사
                </button>
                <button
                  type="button"
                  onClick={() => setIsClassTeacher(false)}
                  className={`flex-1 p-3 border-2 rounded-xl font-bold transition-all ${
                    !isClassTeacher ? 'bg-emerald-500 text-white border-black shadow-school-press' : 'bg-slate-50 border-black hover:bg-slate-100'
                  }`}
                >
                  교과 전담 교사
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2단계: 가정 및 특성 선택 */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">가족 구성 상태</label>
                <select
                  value={familyState}
                  onChange={e => setFamilyState(e.target.value as PlayerInfo['familyState'])}
                  className="w-full border-2 border-black rounded-xl p-3 bg-white font-medium focus:outline-none"
                >
                  <option value="single">독신 (홀가분함)</option>
                  <option value="married">기혼 (배우자와 양자 지원)</option>
                  <option value="parent">자녀 양육 중 (육아 병행)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">출퇴근 소요 거리</label>
                <select
                  value={commuteDistance}
                  onChange={e => setCommuteDistance(e.target.value as PlayerInfo['commuteDistance'])}
                  className="w-full border-2 border-black rounded-xl p-3 bg-white font-medium focus:outline-none"
                >
                  <option value="short">가까움 (도보 10분)</option>
                  <option value="medium">보통 (대중교통 30분)</option>
                  <option value="long">장거리 (왕복 2시간 소모)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                초기 특성 (반드시 2개 선택) *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1">
                {availableTraits.map(trait => {
                  const isSelected = selectedTraits.includes(trait.name);
                  return (
                    <button
                      key={trait.name}
                      type="button"
                      onClick={() => handleToggleTrait(trait.name)}
                      className={`p-3 border-2 border-black rounded-xl text-left transition-all relative flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-amber-100 border-emerald-600 shadow-school-press' 
                          : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-900">{trait.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight mb-1">{trait.desc}</p>
                      <p className="text-[10px] text-red-500 font-medium">⚠️ {trait.penalty}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3단계: 학교 배정 및 난이도 */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">부임지 학교 유형</label>
              <div className="space-y-2">
                {schoolTypes.map(sch => {
                  const isSelected = schoolType === sch.name;
                  return (
                    <button
                      key={sch.name}
                      type="button"
                      onClick={() => setSchoolType(sch.name)}
                      className={`w-full p-3 border-2 border-black rounded-xl text-left transition-all ${
                        isSelected ? 'bg-emerald-50 border-emerald-600 shadow-school-press' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-slate-900 text-sm mb-1">{sch.name}</div>
                      <p className="text-xs text-slate-600">{sch.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">업무 난이도</label>
              <div className="flex gap-2">
                {(['warm', 'realistic', 'hard'] as const).map(diff => {
                  const labels = { warm: '따뜻한 새 학기', realistic: '현실 교무실', hard: '하드코어 공문폭탄' };
                  const desc = { warm: '스탯 보강, 번아웃 감소', realistic: '표준 밸런스 설정', hard: '초기 스탯 패널티, 극심한 피로' };
                  const isSelected = difficulty === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 p-2 border-2 border-black rounded-xl text-center transition-all ${
                        isSelected ? 'bg-amber-100 border-amber-600 shadow-school-press font-bold' : 'bg-white hover:bg-slate-50 text-xs'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{labels[diff]}</div>
                      <div className="text-[9px] text-slate-500 mt-1">{desc[diff]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 최종 정보 카드 */}
            <div className="bg-slate-900 text-white rounded-xl p-4 text-xs font-mono border-2 border-black">
              <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-1 border-b border-white/20 pb-1">
                <Award className="w-4 h-4" /> [최종 요약 서류]
              </h4>
              <p>성명: {name} 교사 ({labelsForExp(experience)})</p>
              <p>배정: {grade}학년 {isClassTeacher ? '학급담임' : '교과전담'}</p>
              <p>배경: {labelsForFamily(familyState)} | {schoolType}</p>
              <p>특성: {selectedTraits.join(', ')}</p>
              <p>기본 난이도: {difficulty === 'warm' ? '쉬움' : difficulty === 'realistic' ? '보통' : '매우 어려움'}</p>
            </div>
          </div>
        )}

        {/* 하단 탐색 버튼 그룹 */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t-2 border-slate-900">
          {step === 1 ? (
            <button
              onClick={onBackToTitle}
              className="btn-school-secondary flex items-center gap-1 text-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              타이틀로
            </button>
          ) : (
            <button
              onClick={handlePrev}
              className="btn-school-secondary flex items-center gap-1 text-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              이전 단계
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="btn-school-primary flex items-center gap-1"
            >
              다음 단계
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="btn-school-accent flex items-center gap-1 py-2 px-6"
            >
              학교 부임하기
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 헬퍼 텍스트
function labelsForExp(exp: string) {
  if (exp === 'newbie') return '신규 발령';
  if (exp === 'junior') return '3-5년차 중견';
  return '10년차 베테랑';
}

function labelsForFamily(fam: string) {
  if (fam === 'single') return '독신';
  if (fam === 'married') return '기혼';
  return '자녀양육';
}
