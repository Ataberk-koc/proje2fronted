export type SocialMedia = {
  link: string;
  platform_name: string;
};

export type Contact = {
  name: string;
  email: string;
};

export type PhoneContact = {
  tag?: string;
  phone: string;
};

export type Settings = {
  site_name: string;
  slogan?: string;
  footer_icon?: string;
  email?: string | Contact | Contact[];
  social_media?: SocialMedia[];
  full_address?: string;
  postal_code?: string;
  working_hours?: string;
  google_embeded_url?: string;
  site_white_logo?: string;
  site_dark_logo?: string;
  favicon?: string;
  address?: string;
  phone?: string | PhoneContact | PhoneContact[];
  country?: string;
  city?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at?: string;
  contacts?: Contact[];
};
