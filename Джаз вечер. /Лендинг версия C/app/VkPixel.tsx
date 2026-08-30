import Script from "next/script";

const rawPixelId = process.env.NEXT_PUBLIC_VK_PIXEL_ID ?? "3790555";
const pixelId = /^\d+$/.test(rawPixelId) ? rawPixelId : null;

export default function VkPixel() {
  if (!pixelId) {
    return null;
  }

  return (
    <>
      <Script id="vk-pixel" strategy="afterInteractive">
        {`var _tmr=window._tmr||(window._tmr=[]);_tmr.push({id:"${pixelId}",type:"pageView",start:(new Date()).getTime()});(function(d,w,id){if(d.getElementById(id))return;var ts=d.createElement("script");ts.type="text/javascript";ts.async=true;ts.id=id;ts.src="https://top-fwz1.mail.ru/js/code.js";var f=function(){var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(ts,s);};if(w.opera=="[object Opera]"){d.addEventListener("DOMContentLoaded",f,false);}else{f();}})(document,window,"tmr-code");`}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://top-fwz1.mail.ru/counter?id=${pixelId};js=na`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
