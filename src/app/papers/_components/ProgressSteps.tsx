import React from "react";

interface ProgressStepsProps {
  progress: number;
  statusText: string;
}

const steps = [
  { label: "텍스트 추출" },
  { label: "표/그림 추출" },
  { label: "GPT 요약" },
  { label: "스켈레톤 생성" },
  { label: "완료" },
];

const getCurrentStep = (progress: number) => {
  if (progress < 40) return 1;
  if (progress < 80) return 2;
  if (progress < 85) return 3;
  if (progress < 100) return 4;
  return 5;
};

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  progress,
  statusText,
}) => {
  const currentStep = getCurrentStep(progress);

  return (
    <div className="xl:w-[80rem] w-[56.25rem] bg-white rounded-xl border border-gray-200 p-8 mb-4 mx-auto">
      <h2 className="text-xl font-bold mb-2">논문 분석중</h2>
      <div className="text-gray-500 mb-4">{statusText}</div>
      <div className="flex items-center mb-6">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  idx + 1 < currentStep
                    ? "bg-[#42598C] border-[#42598C] text-white"
                    : idx + 1 === currentStep
                    ? "bg-[#42598C] border-white text-white"
                    : "bg-white border-gray-300 text-gray-400"
                } font-bold`}
              >
                {idx + 1 < currentStep ? <span>&#10003;</span> : idx + 1}
              </div>
              <span
                className={`mt-2 text-sm ${
                  idx + 1 <= currentStep
                    ? "text-[#12398e] font-semibold"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  idx + 1 < currentStep ? "bg-[#42598C]" : "bg-gray-200"
                }`}
                style={{ minWidth: 32 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* <div className="flex items-center justify-between bg-[#c9d7f5] text-[#42598C] rounded-lg px-6 py-3 font-medium">
        <span>{statusText}</span>
        <span>{progress}%</span>
      </div> */}
    </div>
  );
};

export default ProgressSteps;
