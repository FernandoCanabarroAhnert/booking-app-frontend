import { SafeUrl } from "@angular/platform-browser";

export interface IFileHandle {
    file: File | null;
    url: SafeUrl
}