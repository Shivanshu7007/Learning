import React from "react";

interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: "390px",
        height: "844px",
      }}
    >
      {/* Phone outer shell */}
      <div
        className="absolute inset-0 rounded-[52px]"
        style={{
          background: "linear-gradient(160deg, #2a2a2e, #1a1a1e)",
          boxShadow:
            "0 0 0 1px #3a3a40, 0 30px 80px rgba(0,0,0,0.6), 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      />

      {/* Side buttons */}
      <div className="absolute left-0 top-[130px] w-[3px] h-[34px] rounded-r-full" style={{ background: "#3a3a40", left: "-3px" }} />
      <div className="absolute left-0 top-[178px] w-[3px] h-[64px] rounded-r-full" style={{ background: "#3a3a40", left: "-3px" }} />
      <div className="absolute left-0 top-[255px] w-[3px] h-[64px] rounded-r-full" style={{ background: "#3a3a40", left: "-3px" }} />
      <div className="absolute right-0 top-[166px] w-[3px] h-[80px] rounded-l-full" style={{ background: "#3a3a40", right: "-3px" }} />

      {/* Screen area */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: "12px",
          left: "12px",
          right: "12px",
          bottom: "12px",
          borderRadius: "42px",
          background: "#f8f8f8",
        }}
      >
        {/* Dynamic island */}
        <div
          className="absolute top-[14px] left-1/2 -translate-x-1/2 z-50"
          style={{
            width: "120px",
            height: "36px",
            background: "#000",
            borderRadius: "20px",
          }}
        />

        {/* Screen content */}
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "42px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
