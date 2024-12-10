<script lang="ts">
  import * as m from '$lib/i18n';
  import { languageTag } from '$lib/paraglide/runtime';

  const getLocalizedContent = (lang: string) => {
    switch(lang) {
      case 'ms':
        return {
          description: "Sistem Pengurusan Maklumat Bencana oleh NADMA Malaysia",
          keywords: "NADMA, MyDIMS, bencana, banjir, tanah runtuh, Malaysia, sistem pengurusan bencana, maklumat bencana, pusat pemindahan sementara, PPS",
          language: "Bahasa Melayu",
          locale: "ms_MY"
        };
      case 'zh':
        return {
          description: "NADMA马来西亚灾害管理信息系统",
          keywords: "NADMA, MyDIMS, 灾害, 洪水, 山体滑坡, 马来西亚, 灾害管理系统, 灾害信息, 临时避难所, PPS",
          language: "中文",
          locale: "zh_MY"
        };
      case 'ta':
        return {
          description: "NADMA மலேசியா பேரிடர் மேலாண்மை தகவல் அமைப்பு",
          keywords: "NADMA, MyDIMS, பேரிடர், வெள்ளம், நிலச்சரிவு, மலேசியா, பேரிடர் மேலாண்மை, பேரிடர் தகவல், தற்காலிக தங்குமிடம், PPS",
          language: "தமிழ்",
          locale: "ta_MY"
        };
      default: // 'en'
        return {
          description: "Disaster Management Information System by NADMA Malaysia",
          keywords: "NADMA, MyDIMS, disaster, flood, landslide, Malaysia, disaster management, disaster information, temporary shelter, PPS",
          language: "English",
          locale: "en_MY"
        };
    }
  };

  const currentLang = languageTag();
  const content = getLocalizedContent(currentLang);

  export let title: string = m.title();
  export let description: string = "MyDIMS Dashboard - " + content.description;
  export let image: string = "/og-image.png";
  export let url: string = "https://mydims.nadma.gov.my";
  export let type: string = "website";
  export let keywords: string = content.keywords;
  export let locale: string = content.locale;
  export let alternateLocale: string = currentLang === 'ms' ? 'en_MY' : 'ms_MY';
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />

  <!-- Locale and Language -->
  <meta property="og:locale" content={locale} />
  <meta property="og:locale:alternate" content={alternateLocale} />
  <meta name="language" content={content.language} />
  <meta name="geo.region" content="MY" />
  <meta name="geo.placename" content="Malaysia" />
  <meta name="geo.position" content="4.210484;101.975766" />
  <meta name="ICBM" content="4.210484, 101.975766" />

  <!-- Government and Organization -->
  <meta name="classification" content="Government" />
  <meta name="owner" content="Agensi Pengurusan Bencana Negara (NADMA)" />
  <meta name="author" content="NADMA Malaysia" />
  <meta name="organization" content="Agensi Pengurusan Bencana Negara (NADMA)" />
  <meta name="contact" content="webmaster@nadma.gov.my" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:site_name" content="NADMA MyDIMS" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:alt" content="NADMA MyDIMS Dashboard Preview" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={url} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:site" content="@nadma_malaysia" />
  <meta name="twitter:creator" content="@nadma_malaysia" />
  <meta name="twitter:domain" content={url} />

  <!-- LinkedIn -->
  <meta property="article:publisher" content="https://www.linkedin.com/company/nadma-malaysia" />
  <meta property="article:author" content="NADMA Malaysia" />
  <meta property="article:section" content="Government" />

  <!-- Mobile and Responsive -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="theme-color" content="#0f172a" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

  <!-- Additional Meta Tags -->
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="robots" content="index, follow" />
  <meta name="revisit-after" content="1 days" />
  <meta name="rating" content="General" />
  <meta name="distribution" content="Global" />
  <meta name="copyright" content="  {new Date().getFullYear()} NADMA Malaysia" />

  <!-- Schema.org for Government Organization -->
  <script type="application/ld+json">{
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": "Agensi Pengurusan Bencana Negara (NADMA)",
    "alternateName": "NADMA Malaysia",
    "url": "{url}",
    "logo": "{url}/nadma-logo.svg",
    "sameAs": [
      "https://www.facebook.com/nadma.pmd",
      "https://twitter.com/nadma_malaysia",
      "https://www.instagram.com/nadmamalaysia"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+603-8064-2400",
      "contactType": "customer service",
      "areaServed": "MY",
      "availableLanguage": ["ms", "en", "zh", "ta"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Aras 7, Blok D5, Kompleks D",
      "addressLocality": "Putrajaya",
      "postalCode": "62502",
      "addressCountry": "MY"
    }
  }</script>
</svelte:head>
