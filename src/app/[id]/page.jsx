"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const DEFAULT_ASSET_BASE = "https://cdn.raveum.com";

const getAssetBase = () => {
  const env = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_ASSET_BASE : undefined;
  const raw = env && String(env).trim() ? String(env).trim() : DEFAULT_ASSET_BASE;
  return raw.replace(/\/+$/, "");
};

function normalizeProperty(raw) {
  const ASSET_BASE = getAssetBase();
  
  const toNumber = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return val;
    const num = Number(String(val).trim().replace(/,/g, ""));
    return isNaN(num) ? null : num;
  };

  const cleanString = (val) => {
    if (val === null || val === undefined) return "";
    return String(val).trim();
  };

  const fixThumbnail = (path) => {
    if (!path) return `${ASSET_BASE}/placeholder.png`;
    const cleaned = cleanString(path);
    if (/^https?:\/\//i.test(cleaned)) return cleaned;
    if (/^\/\//.test(cleaned)) return `https:${cleaned}`;
    const stripped = cleaned.replace(/^public\//i, "").replace(/^\/+/, "");
    return `${ASSET_BASE}/${stripped}`;
  };

  return {
    ...raw,
    thumbnail: fixThumbnail(raw.thumbnail),
    propertyPrice: toNumber(raw.propertyPrice),
    sharePrice: toNumber(raw.sharePrice),
    rentalYeild: toNumber(raw.rentalYeild),
    capRatePercentage: toNumber(raw.capRatePercentage),
    capRateValue: toNumber(raw.capRateValue),
    irr: toNumber(raw.irr),
    IPOProperty: toNumber(raw.IPOProperty),
    builtUpArea: toNumber(raw.builtUpArea),
    targetHoldPeriod: toNumber(raw.targetHoldPeriod),
    builtYear: toNumber(raw.builtYear),
  };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const res = await axios.post("https://apis.raveum.com/v1/properties", {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const rawProperties = Array.isArray(data)
    ? data[0]?.properties || []
    : data?.properties || [];
  
  const properties = rawProperties.map(normalizeProperty);
  const property = properties.find((p) => p._id === propertyId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div>
      <button onClick={() => router.push("/")}>← Back</button>
      
      <h1>{property.name}</h1>
      <p>{property.address}</p>
      
      <div>
        <p>Price: ${property.propertyPrice?.toLocaleString()}</p>
        <p>Share Price: ${property.sharePrice}</p>
        <p>Rental Yield: {property.rentalYeild}%</p>
        <p>Cap Rate: {property.capRatePercentage}%</p>
        <p>Built-up Area: {property.builtUpArea} sq ft</p>
        <p>Year Built: {property.builtYear}</p>
      </div>
    </div>
  );
}