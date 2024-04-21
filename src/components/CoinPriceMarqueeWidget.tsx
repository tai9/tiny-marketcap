import React from "react";

const CoinPriceMarqueeWidget = () => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<script type="text/javascript" src="https://files.coinmarketcap.com/static/widget/coinMarquee.js"></script><div id="coinmarketcap-widget-marquee" coins="1,1027,825,1839,6535,5426,2300,30683,29210" currency="USD" theme="dark" transparent="true" show-symbol-logo="true"></div>`,
      }}
    />
  );
};

export default CoinPriceMarqueeWidget;
