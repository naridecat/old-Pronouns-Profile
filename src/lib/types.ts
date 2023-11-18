interface PageData {
    Name: string
}
interface PluginItem {
    id: number,
    name: string,
    selected: boolean
}
interface Pronoun {
    Name: string;
    Emoji: string;
}

interface SNS {
    Name: string;
    Type: string; // Twitter, Discord, Facebook, Instagram
}

interface TokenValidateResponse {
    'error-codes': string[];
    success: boolean;
    action: string;
    cdata: string;
}
