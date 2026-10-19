import React from "react";
import CropAcademy from "./CropAcademy.tsx";

interface AnimalFarmingProps {
  preferredLanguage?: string;
  userId?: string;
}

/**
 * Dedicated Animal Farming Component
 * Curates livestock, poultry, beekeeping, piggery, and fisheries/aquaculture education.
 */
export default function AnimalFarming({
  preferredLanguage = "en",
  userId = "guest-1"
}: AnimalFarmingProps) {
  return (
    <CropAcademy
      mode="animals"
      preferredLanguage={preferredLanguage}
      userId={userId}
    />
  );
}
