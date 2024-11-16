import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MoreVertical, Phone } from 'lucide-react';

export default function PatientCard() {
  return (
    <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader className="flex items-start justify-between mb-2">
        <div className="flex flex-col">
          <div className="relative mb-1">
            <div className="h-12 w-12 bg-[repeating-conic-gradient(#000_0_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg_360deg)]" />
            <CheckCircle2 className="absolute -right-1 -top-1 h-5 w-5 text-gray-500" /> {/* Changed blue to gray */}
          </div>
          <CardTitle>ABC</CardTitle>
          <div className="text-sm text-gray-500">UID: xxxxxxxx</div>
        </div>
        <Button size="sm" variant="default" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-4 w-4 text-gray-600" /> {/* Changed violet to gray */}
          <span className="text-sm text-gray-600">+91 1234567891</span> {/* Changed violet to gray */}
        </div>
        <div className="space-y-2">
          {['Listeners Assigned', 'Case History', 'Chat Data', 'Appointments'].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{item}</span> {/* Changed color to gray */}
              <Badge 
                className="rounded-20 bg-black text-white hover:bg-black px-3 py-0.5 text-xs font-normal"
              >
                View
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
