import { Button } from "@/components/ui/button";
import { Wallet, Cloud, CloudOff } from "lucide-react";

interface HeaderProps {
  isCloudSyncEnabled: boolean;
}

export function Header({ isCloudSyncEnabled }: HeaderProps) {
  return (
    <header className="border-b bg-gradient-to-r from-primary/5 to-primary-glow/5">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                ExpenseTracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Smart expense management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

            {!isCloudSyncEnabled && (
              <Button variant="outline" size="sm">
                Enable Cloud Sync
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
