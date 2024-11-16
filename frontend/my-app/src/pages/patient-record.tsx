import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PatientCard from "@/components/record/PatientCard"; // Import PatientCard component
import Navbar from "@/components/navbar/navbar3"; // Import Navbar component
import { Search, List, Grid, ChevronLeft, ChevronRight } from "lucide-react"; // Import missing icons
import "@/styles/globals.css";

export default function PatientRecords() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar /> {/* Add Navbar component */}

      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Patient Records</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <div className="pl-10">
                <Input
                  id="search-input"
                  type="text"
                  placeholder="Search here"
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <PatientCard key={index} /> 
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-600">1 - 5 of 56</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Page</span>
            <Input type="number" id="page-number" value="1" />
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
