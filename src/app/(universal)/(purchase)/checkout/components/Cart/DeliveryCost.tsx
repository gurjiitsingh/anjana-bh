import { formatCurrencyNumber } from "@/utils/formatCurrency";
import { UseSiteContext } from "@/SiteContext/SiteContext";
import { useLanguage } from "@/store/LanguageContext";
import React from "react";

export default function DeliveryCost() {
  const { deliveryDis, deliveryType } = UseSiteContext();
  const { TEXT } = useLanguage();
   const { settings } = UseSiteContext();
  const delivery_price = formatCurrencyNumber(
    Number(deliveryDis?.price) ?? 0,
    settings.currency as string,
    settings.locale as string
  );

return (
  <>
    {deliveryType === "delivery" && (
      <>
        {delivery_price !== undefined ? (
          <div className="font-semibold border-b py-3 w-full flex justify-between items-center">
            <button className="text-sm font-semibold py-3 w-full text-left">
              {TEXT.deliveryCost.title}
            </button>
            <div className="flex gap-1">
             
              <span>{delivery_price}</span>
            </div>
          </div>
        ) : (
          <div className="font-semibold border-b py-3 w-full flex justify-between items-center">
            <div className="flex gap-1 justify-start w-full">
              <span className="text-sm font-extralight text-red-600">
                {TEXT.deliveryCost.notDeliverableAddress}
              </span>
            </div>
          </div>
        )}
      </>
    )}
  </>
);


}
