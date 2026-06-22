/**
 * Returns a Norwegian city name for a 4-digit postal code, or null if unknown.
 * Coverage is range-based — suitable for prototype use.
 */
export function getCityFromPostalCode(code: string): string | null {
  if (!/^\d{4}$/.test(code)) return null;
  const num = parseInt(code, 10);

  if (num >= 1 && num <= 1299) return "Oslo";
  if (num >= 1300 && num <= 1380) return "Bærum";
  if (num >= 1381 && num <= 1480) return "Asker";
  if (num >= 1481 && num <= 1530) return "Moss";
  if (num >= 1531 && num <= 1620) return "Fredrikstad";
  if (num >= 1621 && num <= 1780) return "Halden";
  if (num >= 1781 && num <= 1900) return "Askim";
  if (num >= 1901 && num <= 2000) return "Lillestrøm";
  if (num >= 2001 && num <= 2100) return "Hamar";
  if (num >= 2101 && num <= 2300) return "Lillehammer";
  if (num >= 2301 && num <= 2500) return "Gjøvik";
  if (num >= 2501 && num <= 2800) return "Elverum";
  if (num >= 2801 && num <= 3000) return "Kongsvinger";
  if (num >= 3001 && num <= 3050) return "Drammen";
  if (num >= 3051 && num <= 3300) return "Hønefoss";
  if (num >= 3301 && num <= 3550) return "Kongsberg";
  if (num >= 3551 && num <= 3800) return "Notodden";
  if (num >= 3801 && num <= 3999) return "Skien";
  if (num >= 4001 && num <= 4099) return "Stavanger";
  if (num >= 4100 && num <= 4250) return "Bryne";
  if (num >= 4251 && num <= 4500) return "Haugesund";
  if (num >= 4501 && num <= 4899) return "Kristiansand";
  if (num >= 4900 && num <= 5000) return "Arendal";
  if (num >= 5001 && num <= 5099) return "Bergen";
  if (num >= 5100 && num <= 5300) return "Voss";
  if (num >= 5301 && num <= 5600) return "Florø";
  if (num >= 5601 && num <= 6000) return "Sogndal";
  if (num >= 6001 && num <= 6099) return "Ålesund";
  if (num >= 6100 && num <= 6400) return "Molde";
  if (num >= 6401 && num <= 6600) return "Kristiansund";
  if (num >= 6601 && num <= 7000) return "Sunndalsøra";
  if (num >= 7001 && num <= 7099) return "Trondheim";
  if (num >= 7100 && num <= 7500) return "Steinkjer";
  if (num >= 7501 && num <= 7800) return "Namsos";
  if (num >= 7801 && num <= 8000) return "Mosjøen";
  if (num >= 8001 && num <= 8099) return "Bodø";
  if (num >= 8100 && num <= 8400) return "Fauske";
  if (num >= 8401 && num <= 8800) return "Narvik";
  if (num >= 8801 && num <= 9000) return "Mo i Rana";
  if (num >= 9001 && num <= 9099) return "Tromsø";
  if (num >= 9100 && num <= 9400) return "Finnsnes";
  if (num >= 9401 && num <= 9900) return "Harstad";
  if (num >= 9901 && num <= 9999) return "Kirkenes";

  return null;
}
