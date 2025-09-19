export type TranslationObject = {
  es: string;
  en: string;
};

export interface HubAction {
  type: string;
  payload: Record<string, any>;
}

export interface HubPanel {
  id: string;
  title: TranslationObject;
  icon?: string;
  imageUrl?: string;
  action: HubAction;
}

export interface PromotionalHub {
  id: string;
  mainPanel: HubPanel;
  secondaryPanels: [HubPanel, HubPanel];
}

export interface PromotionalHubGroup {
  title: TranslationObject;
  hubs: PromotionalHub[];
}
