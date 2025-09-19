import { HubAction } from './promotionalHub';

export interface EditorialCard {
  id: string;
  imageUrl: string;
  title: TranslationObject;
  action: HubAction;
  testID?: string;
}
export type TranslationObject = {
  es: string;
  en: string;
};
