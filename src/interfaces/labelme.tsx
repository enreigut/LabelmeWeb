export interface Flag {

};

export interface Shape {
    label: string;
    points: Array<Array<number>>;
    group_id: string | null;
    shape_type: string;
    flags: Flag;
};

export interface Labelme {
    version: string;
    flags: Flag;
    shapes: Array<Shape>;
    imageHeight: number;
    imageWidth: number;
};
