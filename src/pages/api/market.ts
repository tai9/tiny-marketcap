// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await axios.get(
      "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing",
      {
        params: {
          start: 1,
          limit: 20,
          sortBy: "market_cap",
          sortType: "desc",
          convert: "USD,BTC,ETH",
          cryptoType: "all",
          tagType: "all",
          audited: false,
          aux: "ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,max_supply,circulating_supply,total_supply,volume_7d,volume_30d,self_reported_circulating_supply,self_reported_market_cap",
          ...req.query,
        },
      }
      //   {
      //     headers: {
      //       "X-CMC_PRO_API_KEY": "f1b7dee8-e2d4-44e3-bb49-09685242a6f2",
      //     },
      //   }
    );
    res.status(200).json(response.data.data);
  } catch (ex) {
    // error
    res.status(500);
  }
}
