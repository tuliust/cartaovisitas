# Metadados de compartilhamento

As metatags definidas em `index.html` são genéricas para todo o sistema de cartões digitais. Como a aplicação pública é uma SPA, robôs de compartilhamento podem ler o HTML antes que o React carregue os dados de cada cartão.

Metatags específicas por cartão exigirão futuramente SSR, prerenderização por slug ou uma função dedicada que entregue HTML com os dados do cartão.

A configuração administrativa armazena `og_image_url` para preview e uso futuro. Alterar esse campo no navegador não substitui a imagem estática de `index.html` para crawlers; uma integração futura com SSR, prerenderização ou etapa de deploy deverá gerar as metatags servidas no HTML.
