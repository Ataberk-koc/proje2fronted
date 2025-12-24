import { NextResponse } from "next/server";

export async function GET() {
  // Dummy data, replace with your real API logic
  return NextResponse.json([
    {
      id: 1,
      image: "/slider1.jpg",
      title: "Slider Başlık 1",
      description: "Slider açıklaması 1."
    },
    {
      id: 2,
      image: "/slider2.jpg",
      title: "Slider Başlık 2",
      description: "Slider açıklaması 2."
    }
  ]);
}
