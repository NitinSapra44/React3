"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

export default function CarouselSize({ properties }) {
  const router = useRouter();
  const placeholderImg = "https://placehold.co/600x400?text=No+Image";
  const propertyList = Array.isArray(properties) ? properties : [];

  const [likedProperties, setLikedProperties] = useState(new Set());

  
  useEffect(() => {
    const saved = localStorage.getItem("likedProperties");
    if (saved) {
      setLikedProperties(new Set(JSON.parse(saved)));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("likedProperties", JSON.stringify([...likedProperties]));
  }, [likedProperties]);

  // Toggle like status
  const toggleLike = (propertyId, e) => {
    e.stopPropagation(); 
    setLikedProperties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  if (propertyList.length === 0) {
    return (
      <div className="w-full max-w-full p-8 text-center">
        <p className="text-gray-500 text-lg">No properties available.</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="w-full max-w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {propertyList.map((property) => {
          const imageUrl = property.thumbnail
            ? property.thumbnail.startsWith("http")
              ? property.thumbnail
              : `https://cdn.raveum.com/${property.thumbnail}`
            : placeholderImg;

          const isLiked = likedProperties.has(property._id);

          return (
            <CarouselItem
              key={property._id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              onClick={() => {
                router.push(`/${property._id}`);
              }}
            >
              <div className="p-1">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative">
                 
                  <button
                    onClick={(e) => toggleLike(property._id, e)}
                    className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isLiked ? "red" : "none"}
                      stroke={isLiked ? "red" : "currentColor"}
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                      />
                    </svg>
                  </button>

                  <CardContent className="p-0">
                    <div className="relative w-full h-48 bg-gray-200">
                      <Image
                        src={imageUrl}
                        alt={property.name || "Property image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.src = placeholderImg;
                        }}
                      />
                    </div>
            
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {property.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {property.address}
                      </p>
                      <div className="space-y-2">
                        <p className="flex justify-between text-sm">
                          <span>Price:</span>
                          <span className="font-bold">
                            ${property.propertyPrice?.toLocaleString()}
                          </span>
                        </p>
                        <p className="flex justify-between text-sm">
                          <span>Share Price:</span>
                          <span className="font-semibold">
                            ${property.sharePrice}
                          </span>
                        </p>
                        <p className="flex justify-between text-sm">
                          <span>Yield:</span>
                          <span className="font-semibold">
                            {property.rentalYeild}%
                          </span>
                        </p>
                        <p className="flex justify-between text-sm">
                          <span>Cap Rate:</span>
                          <span className="font-semibold">
                            {property.capRatePercentage}%
                          </span>
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 text-xs flex gap-4">
                        <span>{property.builtUpArea} sq ft</span>
                        <span>{property.builtYear}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}