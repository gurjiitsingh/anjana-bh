"use client";

import SiteContext from "./SiteContext";
import { useEffect, useState } from "react";
import { deliveryType } from "@/lib/types/deliveryType";
import { couponType } from "@/lib/types/couponType";
import { getAllSettings } from "@/app/(universal)/action/setting/dbOperations";
import { SettingsDataType } from "@/lib/types/settings";
import { ProductType } from "@/lib/types/productType";

interface Props {
  children: React.ReactNode;
}

export const SiteProvider: React.FC<Props> = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  //     const setcouponType ={
  //         couponDesc:{},
  // isFeatured:boolean,
  // minSpend:number,
  // name:string,
  // price:string,
  // productCat:string,
  // deliveryDis:{},
  // setdeliveryDis:(e)=>{return e}

  //  }

  const [open, setIsOpen] = useState<boolean>(false);
  const [openBargerMenu, setOpenBargerMenu] = useState<boolean>(false);
  const [openEmailForm, setEmailFormToggle] = useState<boolean>(false);
  const [customerEmail, setCustomerEmailL] = useState<string>("");
  const [customerAddressIsComplete, setCustomerAddressIsCompleteL] =
    useState(false);
  const [deliveryType, setDeliveryType] = useState<string>("pickup");
  const [couponDisc, setCouponDiscU] = useState<couponType | undefined>();
  const [deliveryDis, setdeliveryDisU] = useState<deliveryType | null>(null);
  const [showProductDetailM, setShowProductDetailML] = useState<boolean>(false);
  const [baseProductId, setBaseProductIdL] = useState<string>("");
  const [adminSideBarToggle, setAdminSideBarToggleL] = useState<boolean>(false);
  const [productCategoryIdG, setProductCategoryIdL] = useState<string>("");
  const [newOrderCondition, setNewOrderConditionL] = useState<boolean>(false);
  const [paymentType, setPaymentTypeL] = useState<string>("");
  const [deliveryCost, setDeliveryCostL] = useState<number>(0);
  const [settings, setSettings] = useState<SettingsDataType>({});
  //const [disablePickupCatDiscountIds, setDisablePickupCatDiscountIdsL] = useState<string[] | null>(null);
  const [disablePickupCatDiscountIds, setDisablePickupCatDiscountIdsL] =
    useState<string[]>([]);
  const [allProduct, setAllProduct] = useState<ProductType[]>([]);
  const [productToSearchQuery, setProductToSearchQuery] = useState("");
  // useEffect(() => {
  //   getAllSettings().then(setSettings).catch(console.error);
  // }, []);
//  useEffect(() => {
//   getAllSettings()
//     .then((fetched) => {
//       setSettings({
//         // currency: fetched.currency || process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'EUR',
//         // locale: fetched.locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'de-DE',
//         // ...fetched, // place this last so fetched values override defaults if present
//           currency:  process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'GBP',
//         locale:  process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en-GB',
       
//       });
//     })
//     .catch((err) => {
//       console.error("Error fetching settings:", err);
//       // fallback to .env if Firestore fetch fails
//       setSettings({
//         currency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'GBP',
//         locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en-GB',
//       });
//     });
// }, []);

useEffect(() => {
  getAllSettings()
    .then((fetched) => {

      // ✅ Start with everything Firestore provides
      const merged: SettingsDataType = { ...fetched };

      // ✅ Apply .env fallback ONLY if Firestore key is missing

      if (merged.currency == null) {
        merged.currency = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? null;
      }

      if (merged.locale == null) {
        merged.locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? null;
      }

      if (merged.display_category == null) {
        merged.display_category = process.env.NEXT_PUBLIC_DEFAULT_DISPLAY_CATEGORY ?? null;
      }

      // ✅ Done — everything else stays exactly as Firestore sent
      setSettings(merged);
    })
    .catch((err) => {
      console.error("Error fetching settings:", err);

      // ✅ Firestore failed → ONLY .env values (NO hardcoded defaults)
      setSettings({
        currency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? null,
        locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? null,
        display_category: process.env.NEXT_PUBLIC_DEFAULT_DISPLAY_CATEGORY ?? null,
      });
    });
}, []);


  useEffect(() => {
    const stored = localStorage.getItem("disablePickupCatDiscountIds");
    try {
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        setDisablePickupCatDiscountIdsL(parsed);
      } else {
        setDisablePickupCatDiscountIdsL([]);
      }
    } catch {
      setDisablePickupCatDiscountIdsL([]);
    }
  }, []);

  useEffect(() => {
    const deliveryType = window.localStorage.getItem("delivery_type") as string;
    if (deliveryType !== undefined) {
      const deliveryTypeS = JSON.parse(deliveryType) as string;
      setDeliveryType(deliveryTypeS);
    }
    const customerEmail = window.localStorage.getItem(
      "customer_email"
    ) as string;
    if (customerEmail !== undefined) {
      const customerEmailS = JSON.parse(customerEmail) as string;
      setCustomerEmailL(customerEmailS);
    }
  }, []);

  function togleMenu() {
    setIsOpen(!open);
  }
  function bargerMenuToggle() {
    setOpenBargerMenu(!openBargerMenu);
  }
  function chageDeliveryType(t: string) {
    window.localStorage.setItem("delivery_type", JSON.stringify(t));
    setDeliveryType(t);
  }

  function setCouponDisc(e: couponType | undefined) {
    setCouponDiscU(e);
  }
  function setdeliveryDis(e: deliveryType | null) {
    setdeliveryDisU(e);
  }
  // deliveryDis:{},
  // setdeliveryDis:(e)=>{}

  // openEmailForm:false,
  function emailFormToggle(e: boolean) {
    setEmailFormToggle(e);
  }

  function setShowProductDetailM() {
    setShowProductDetailML(!showProductDetailM);
    //showProductDetailM,
  }

  function setBaseProductId(e: string) {
    setBaseProductIdL(e);
  }

  function setCustomerEmailG(e: string) {
    window.localStorage.setItem("customer_email", JSON.stringify(e));
    setCustomerEmailL(e);
  }
  function setCustomerAddressIsComplete(e: boolean) {
    setCustomerAddressIsCompleteL(e);
  }

  function setAdminSideBarToggleG(e: boolean) {
    setAdminSideBarToggleL(e);
  }

  function setProductCategoryIdG(id: string) {
    setProductCategoryIdL(id);
  }
  function setNewOrderCondition(s: boolean) {
    setNewOrderConditionL(s);
  }

  function setPaymentType(s: string) {
    setPaymentTypeL(s);
  }

  function setDeliveryCost(e: number) {
    setDeliveryCostL(e);
  }
  function setDisablePickupCatDiscountIds(CatIds: string[]) {
    setDisablePickupCatDiscountIdsL(CatIds);
    localStorage.setItem("disablePickupCatDiscountIds", JSON.stringify(CatIds));
  }
  return (
    <SiteContext.Provider
      value={{
        allProduct,
        setAllProduct,
        // handleSearchForm,
        // setHandleSearchForm,
        productToSearchQuery,
        setProductToSearchQuery,
        paymentType,
        setPaymentType,
        newOrderCondition,
        setNewOrderCondition,
        open,
        openBargerMenu,
        sideBarToggle: togleMenu,
        bargerMenuToggle,
        openEmailForm,
        emailFormToggle,
        deliveryType,
        chageDeliveryType,
        deliveryCost,
        setDeliveryCost,
        couponDisc,
        setCouponDisc,
        deliveryDis,
        setdeliveryDis,
        showProductDetailM,
        setShowProductDetailM,
        baseProductId,
        setBaseProductId,
        adminSideBarToggle,
        setAdminSideBarToggleG,
        setCustomerEmailG,
        customerEmail,
        setCustomerAddressIsComplete,
        customerAddressIsComplete,
        setProductCategoryIdG,
        productCategoryIdG,
        disablePickupCatDiscountIds,
        setDisablePickupCatDiscountIds,
        settings,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
