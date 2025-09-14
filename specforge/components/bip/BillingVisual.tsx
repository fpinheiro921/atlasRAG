
import React from 'react';
import { WindowMockup } from '../landing/WindowMockup';

const PlanCardVisual: React.FC<{ title: string; price: string; isCurrent?: boolean; isPopular?: boolean; cta: string; }> = ({ title, price, isCurrent, isPopular, cta }) => (
  <div className={`bg-base p-4 rounded-lg shadow-md flex flex-col h-full border-2 transition-all text-center ${isCurrent ? 'border-accent' : 'border-panel'}`}>
    {isPopular && <div className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full self-center -mt-6 mb-2">Most Popular</div>}
    <h3 className="text-sm font-bold text-text-heading font-display">{title}</h3>
    <div className="my-2">
      <span className="text-2xl font-extrabold text-text-heading">{price}</span>
      <span className="text-text-muted text-xs ml-1">/ mo</span>
    </div>
    <ul className="text-xs text-text-muted space-y-1 flex-grow mb-3">
      <li>✓ Feature A</li>
      <li>✓ Feature B</li>
      {isCurrent ? <li className="line-through">✗ Pro Feature</li> : <li>✓ Pro Feature</li>}
    </ul>
    <button className={`w-full mt-auto py-1.5 px-3 rounded-md font-semibold text-xs transition-colors ${isCurrent ? 'bg-accent/20 text-accent' : 'bg-accent text-white'}`}>
      {isCurrent ? 'Current Plan' : cta}
    </button>
  </div>
);

export const BillingVisual: React.FC = () => {
  return (
    <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 my-8">
      <WindowMockup contentClassName="p-4 sm:p-6">
        <div className="text-center mb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-text-heading font-display">
            Find a Plan That's Right For <span className="text-accent">You</span>
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <PlanCardVisual title="Spark" price="$0" isCurrent cta="Your Plan" />
          <PlanCardVisual title="Pro" price="$19" isPopular cta="Upgrade" />
          <PlanCardVisual title="Team" price="$49" cta="Upgrade" />
        </div>
      </WindowMockup>
    </div>
  );
};
