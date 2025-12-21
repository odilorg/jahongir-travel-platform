"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Users } from "lucide-react"
import { useState } from "react"

export function HeroSection() {
  const [searchData, setSearchData] = useState({
    destination: "",
    date: "",
    guests: "",
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search:", searchData)
    // TODO: Implement search functionality
  }

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=1920&h=1080&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            JAHONGIR TRAVEL
            <br />
            <span className="text-2xl md:text-3xl lg:text-4xl font-normal">Your Gateway to Uzbekistan</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Discover the ancient cities of the Silk Road with expert local guides
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Destination */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destination
                </label>
                <Input
                  placeholder="Where to?"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Travel Date
                </label>
                <Input
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Guests
                </label>
                <Input
                  type="number"
                  placeholder="Number of guests"
                  min="1"
                  value={searchData.guests}
                  onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-4 h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Tours
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
