export interface ReservedKeywordConfiguration {
    polygonColor: string;
    description: string;
};

export type ReservedKeyword = Record<string, ReservedKeywordConfiguration>;
