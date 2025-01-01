"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const ServiceDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const services = [
    {
      title: "Match a Listener",
      description: "Get matched with a supportive listener for your needs",
      icon: Users,
      href: "/match-a-listener",
      color: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Book Appointment",
      description: "Schedule a session at your preferred time",
      icon: Calendar,
      href: "/appointment",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 text-sm px-4 py-2 text-white  transition-colors"
        )}
      >
        <span>Services</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30"
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 z-40"
            >
              <Card className="shadow-lg border-gray-200">
                <CardHeader>
                  <CardTitle>Our Services</CardTitle>
                  <h3>Choose the service that best fits your needs</h3>
                </CardHeader>
                <div className="p-4">
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      className="block"
                    >
                      <div
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg mb-2 transition-all",
                          "hover:shadow-md cursor-pointer",
                          service.color
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            "bg-white/80 backdrop-blur-sm",
                            service.iconColor
                          )}
                        >
                          <service.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{service.title}</h3>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceDropdown;
