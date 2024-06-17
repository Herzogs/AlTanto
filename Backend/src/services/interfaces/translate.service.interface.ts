export interface ITranslateText {
    translate(text: string): Promise<string>;
}