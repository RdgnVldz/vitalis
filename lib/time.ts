function safeZone(timezone: string | null | undefined) {
  if (!timezone) return "UTC";

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return timezone;
  } catch {
    return "UTC";
  }
}

export function getDayInfo(
  timezone: string | null | undefined,
  now: Date = new Date()
) {
  const zone = safeZone(timezone);

  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: zone,
    }).format(now)
  );

  let greeting = "Hello";
  if (hour >= 5 && hour < 12) greeting = "Good morning";
  else if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  else if (hour >= 18 && hour < 22) greeting = "Good evening";

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: zone,
  }).format(now);

  return { greeting, dateLabel, zone };
}