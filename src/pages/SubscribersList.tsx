
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Subscriber {
  email: string;
  date: string;
}

const SubscribersList = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load subscribers from localStorage
    const savedSubscribers = localStorage.getItem("newsletter-subscribers");
    if (savedSubscribers) {
      try {
        setSubscribers(JSON.parse(savedSubscribers));
      } catch (e) {
        console.error("Error parsing subscribers:", e);
        toast.error("Could not load subscribers data");
      }
    }
  }, []);

  const handleDeleteSubscriber = (email: string) => {
    const confirmed = window.confirm(`Are you sure you want to remove ${email} from the mailing list?`);
    if (!confirmed) return;

    const updatedSubscribers = subscribers.filter(sub => sub.email !== email);
    try {
      localStorage.setItem("newsletter-subscribers", JSON.stringify(updatedSubscribers));
      setSubscribers(updatedSubscribers);
      toast.success(`Removed ${email} from the mailing list`);
    } catch (e) {
      toast.error("Failed to remove subscriber");
      console.error("Error removing subscriber:", e);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      "Email,Subscription Date",
      ...subscribers.map(sub => `${sub.email},${new Date(sub.date).toLocaleString()}`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maggies-books-subscribers-${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Subscriber list downloaded successfully");
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Button>
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Input 
              type="text"
              placeholder="Search emails..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-8"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              onClick={handleExportCSV}
              disabled={subscribers.length === 0}
              className="w-full md:w-auto"
            >
              Export CSV
            </Button>
          </div>
        </div>
        
        {subscribers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">No subscribers yet</p>
            <p className="mt-2">When people join your mailing list, they'll appear here</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-500">Total subscribers: {subscribers.length}</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Subscribed
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.email}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subscriber.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(subscriber.date).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteSubscriber(subscriber.email)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscribersList;
