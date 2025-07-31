import { Button } from "@/components/ui/button";
import { Wallet, Cloud, CloudOff, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface HeaderProps {
  isCloudSyncEnabled: boolean;
}

export function Header({ isCloudSyncEnabled }: HeaderProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast("Signed Out", {
        description: "You have been successfully signed out.",
      });
    } catch {
      toast("Error", {
        description: "Failed to sign out. Please try again.",
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <header className="border-b ">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ExpenseTracker</h1>
              <p className="text-sm text-muted-foreground">
                Smart expense management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              {isCloudSyncEnabled ? (
                <>
                  <Cloud className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">
                    Cloud Sync Active
                  </span>
                </>
              ) : (
                <>
                  <CloudOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Local Storage</span>
                </>
              )}
            </div>

            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate max-w-32">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
