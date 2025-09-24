"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Smartphone,
  Wifi,
  Users,
  TrendingUp,
  Zap,
  Satellite,
  Radio,
  Network,
  MapPin,
  Activity,
  Building2,
  Cloud,
  Brain,
  ChevronDown,
  ChevronUp,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

type RegionId =
  | "global"
  | "asia"
  | "europe"
  | "americas"
  | "africa"
  | "middle-east";

type Stat = {
  title: string;
  value: string;
  change: string;
  icon: JSX.Element;
  color: string; // tailwind gradient from/to
};

type Region = {
  id: RegionId;
  name: string;
  subscribers: string;
  coverage: string;
  avgSpeed: string;
  companies: number;
};

type Company = {
  name: string;
  country: string;
  subscribers: string;
  revenue: string;
  technology: string;
  color: string;
  icon: JSX.Element;
};

type Tech = {
  id: string;
  name: string;
  adoption: string;
  description: string;
  features: string[];
  regions: Record<string, string>;
};

// ---- Data ----

const GLOBAL_STATS: Stat[] = [
  {
    title: "المشتركين العالميين",
    value: "8.58B",
    change: "+3.2%",
    icon: <Users className="h-6 w-6" />,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "تغطية 5G",
    value: "35%",
    change: "+12%",
    icon: <Radio className="h-6 w-6" />,
    color: "from-green-500 to-green-600",
  },
  {
    title: "مستخدمي الإنترنت",
    value: "5.16B",
    change: "+1.9%",
    icon: <Globe className="h-6 w-6" />,
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "انتشار الهاتف المحمول",
    value: "109%",
    change: "+0.8%",
    icon: <Smartphone className="h-6 w-6" />,
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "متوسط السرعة",
    value: "85 Mbps",
    change: "+15%",
    icon: <Zap className="h-6 w-6" />,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "القيمة السوقية",
    value: "$1.8T",
    change: "+4.1%",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "from-pink-500 to-pink-600",
  },
];

const REGIONS: Region[] = [
  {
    id: "global",
    name: "نظرة عالمية",
    subscribers: "8.58B",
    coverage: "35%",
    avgSpeed: "85 Mbps",
    companies: 2847,
  },
  {
    id: "asia",
    name: "آسيا والمحيط الهادئ",
    subscribers: "4.2B",
    coverage: "42%",
    avgSpeed: "95 Mbps",
    companies: 1245,
  },
  {
    id: "europe",
    name: "أوروبا",
    subscribers: "1.1B",
    coverage: "78%",
    avgSpeed: "120 Mbps",
    companies: 456,
  },
  {
    id: "americas",
    name: "الأمريكتين",
    subscribers: "1.8B",
    coverage: "65%",
    avgSpeed: "110 Mbps",
    companies: 678,
  },
  {
    id: "africa",
    name: "أفريقيا",
    subscribers: "1.2B",
    coverage: "18%",
    avgSpeed: "45 Mbps",
    companies: 234,
  },
  {
    id: "middle-east",
    name: "الشرق الأوسط",
    subscribers: "280M",
    coverage: "55%",
    avgSpeed: "75 Mbps",
    companies: 134,
  },
];

const COMPANIES: Company[] = [
  {
    name: "تشاينا موبايل",
    country: "الصين",
    subscribers: "975M",
    revenue: "$109B",
    technology: "رائدة 5G",
    color: "from-red-500 to-red-600",
    icon: <Building2 className="h-6 w-6" />,
  },
  {
    name: "فودافون جروب",
    country: "المملكة المتحدة",
    subscribers: "300M",
    revenue: "$52B",
    technology: "رائدة إنترنت الأشياء",
    color: "from-red-400 to-pink-500",
    icon: <Network className="h-6 w-6" />,
  },
  {
    name: "فيريزون",
    country: "الولايات المتحدة",
    subscribers: "143M",
    revenue: "$136B",
    technology: "5G الترا",
    color: "from-blue-500 to-indigo-600",
    icon: <Satellite className="h-6 w-6" />,
  },
  {
    name: "إيه تي آند تي",
    country: "الولايات المتحدة",
    subscribers: "230M",
    revenue: "$171B",
    technology: "رائدة الألياف",
    color: "from-blue-400 to-cyan-500",
    icon: <Wifi className="h-6 w-6" />,
  },
  {
    name: "دويتشه تيليكوم",
    country: "ألمانيا",
    subscribers: "242M",
    revenue: "$122B",
    technology: "الحوسبة الطرفية",
    color: "from-pink-500 to-purple-600",
    icon: <Cloud className="h-6 w-6" />,
  },
  {
    name: "سوفت بنك",
    country: "اليابان",
    subscribers: "88M",
    revenue: "$47B",
    technology: "تكامل الذكاء الاصطناعي",
    color: "from-yellow-500 to-orange-600",
    icon: <Brain className="h-6 w-6" />,
  },
];

const TECHNOLOGIES: Tech[] = [
  {
    id: "5g",
    name: "شبكات 5G",
    adoption: "35%",
    description: "تقنية لاسلكية من الجيل التالي بزمن استجابة منخفض للغاية",
    features: [
      "سرعات تصل إلى 20 جيجابت في الثانية نظرياً",
      "زمن استجابة 1 مللي ثانية للتطبيقات الفورية",
      "اتصال هائل لأجهزة إنترنت الأشياء",
      "قدرات تقسيم الشبكة",
      "النطاق العريض المحمول المحسن",
      "اتصالات حرجة المهام",
    ],
    regions: {
      "آسيا والمحيط الهادئ": "42%",
      أوروبا: "78%",
      الأمريكتين: "65%",
      أفريقيا: "18%",
      "الشرق الأوسط": "55%",
    },
  },
  {
    id: "fiber",
    name: "الألياف البصرية",
    adoption: "68%",
    description: "بنية تحتية للإنترنت عالي السرعة باستخدام إشارات ضوئية",
    features: [
      "سرعات جيجابت للمستهلكين",
      "تحميل/تنزيل متماثل",
      "زمن استجابة منخفض وموثوقية عالية",
      "بنية تحتية مستقبلية",
      "دعم لبث 8K",
      "اتصال على مستوى المؤسسات",
    ],
    regions: {
      "آسيا والمحيط الهادئ": "72%",
      أوروبا: "85%",
      الأمريكتين: "78%",
      أفريقيا: "25%",
      "الشرق الأوسط": "60%",
    },
  },
  {
    id: "satellite",
    name: "إنترنت الأقمار الصناعية",
    adoption: "12%",
    description: "اتصال عالمي من خلال أقمار صناعية في مدار أرضي منخفض",
    features: [
      "تغطية عالمية تشمل المناطق النائية",
      "كوكبات المدار الأرضي المنخفض",
      "اتصالات التعافي من الكوارث",
      "اتصال بحري وطيران",
      "سد الفجوة الرقمية",
      "شبكات الاستجابة للطوارئ",
    ],
    regions: {
      "آسيا والمحيط الهادئ": "8%",
      أوروبا: "15%",
      الأمريكتين: "18%",
      أفريقيا: "22%",
      "الشرق الأوسط": "12%",
    },
  },
];

// Sample time‑series for charts (mock)
const TRAFFIC_SERIES = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}`.padStart(2, "0"),
  traffic: Math.round(60 + Math.sin(i / 2) * 25 + i * 2),
}));

const ADOPTION_SERIES = [
  { name: "5G", value: 35 },
  { name: "Fiber", value: 68 },
  { name: "Satellite", value: 12 },
];

// ---- Components ----

function KpiCard({ s }: { s: Stat }) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${s.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white`}
        >
          {s.icon}
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{s.value}</div>
          <div className="text-sm text-muted-foreground mb-1">{s.title}</div>
          <Badge
            variant="outline"
            className="text-xs text-green-600 border-green-200 dark:border-green-900/40 dark:text-green-400"
          >
            {s.change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function RegionCard({
  r,
  active,
  onClick,
}: {
  r: Region;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      role="button"
      aria-pressed={active}
      tabIndex={0}
      onClick={onClick}
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
        active ? "ring-2 ring-primary" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg">{r.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">المشتركين</div>
            <div className="font-semibold text-lg">{r.subscribers}</div>
          </div>
          <div>
            <div className="text-muted-foreground">تغطية 5G</div>
            <div className="font-semibold text-lg">{r.coverage}</div>
          </div>
          <div>
            <div className="text-muted-foreground">متوسط السرعة</div>
            <div className="font-semibold text-lg">{r.avgSpeed}</div>
          </div>
          <div>
            <div className="text-muted-foreground">الشركات</div>
            <div className="font-semibold text-lg">{r.companies}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TechAccordion({
  tech,
  expanded,
  onToggle,
}: {
  tech: Tech;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-xl">{tech.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{tech.description}</p>
              <Badge className="mt-2">الاعتماد العالمي: {tech.adoption}</Badge>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="h-6 w-6 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">الميزات الرئيسية</h4>
                  <ul className="space-y-2">
                    {tech.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 inline-block w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">الاعتماد الإقليمي</h4>
                  <div className="space-y-3">
                    {Object.entries(tech.regions).map(
                      ([region, percentage]) => (
                        <div
                          key={region}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{region}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full">
                              <div
                                className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                style={{ width: percentage }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {percentage}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function GlobalTelecommunicationsRedesign() {
  const [selectedRegion, setSelectedRegion] = useState<RegionId>("global");
  const [expanded, setExpanded] = useState<string | null>("5g");
  const [q, setQ] = useState("");
  const [dark, setDark] = useState(false);

  const filteredCompanies = useMemo(() => {
    const rName = REGIONS.find((r) => r.id === selectedRegion)?.name || "";
    return COMPANIES.filter((c) =>
      [c.name, c.country, c.technology, rName].some((v) =>
        v.toLowerCase().includes(q.toLowerCase())
      )
    );
  }, [q, selectedRegion]);

  return (
    <div className={dark ? "dark" : ""}>
      <div
        className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 p-4"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent dark:from-white dark:to-blue-300">
                    الاتصالات العالمية
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    نظرة شاملة على مشهد الاتصالات العالمي والتقنيات واتجاهات
                    السوق
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-2 shadow-sm">
                  <Sun className="h-4 w-4" />
                  <Switch
                    checked={dark}
                    onCheckedChange={setDark}
                    aria-label="تبديل الوضع الليلي"
                  />
                  <Moon className="h-4 w-4" />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="ابحث عن شركة أو تقنية…"
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>
          </motion.header>

          {/* KPIs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
          >
            {GLOBAL_STATS.map((s, i) => (
              <KpiCard s={s} key={i} />
            ))}
          </motion.section>

          {/* Region + Charts */}
          <Tabs
            defaultValue="global"
            value={selectedRegion}
            onValueChange={(v) => setSelectedRegion(v as RegionId)}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                نظرة إقليمية
              </h2>
              <TabsList className="overflow-x-auto">
                {REGIONS.map((r) => (
                  <TabsTrigger
                    key={r.id}
                    value={r.id}
                    className="min-w-[120px]"
                  >
                    {r.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={selectedRegion} className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REGIONS.map((r) => (
                  <RegionCard
                    key={r.id}
                    r={r}
                    active={selectedRegion === r.id}
                    onClick={() => setSelectedRegion(r.id)}
                  />
                ))}
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>حركة البيانات الشهرية (مؤشر)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64"></CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>تبني التقنيات</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64"></CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Companies */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              مشغلو الاتصالات العالميون الرائدون
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((c, i) => (
                <Card
                  key={i}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <CardHeader
                    className={`bg-gradient-to-r ${c.color} text-white p-6 group-hover:scale-105 transition-transform`}
                  >
                    <div className="flex items-center gap-3">
                      {c.icon}
                      <div>
                        <CardTitle className="text-lg">{c.name}</CardTitle>
                        <p className="text-white/90 text-sm">{c.country}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المشتركين</span>
                        <span className="font-semibold">{c.subscribers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الإيرادات</span>
                        <span className="font-semibold">{c.revenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">التقنية</span>
                        <Badge
                          variant="outline"
                          className="border-white/30 text-foreground"
                        >
                          {c.technology}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredCompanies.length === 0 && (
                <p className="text-center col-span-full text-muted-foreground">
                  لا توجد نتائج مطابقة لبحثك.
                </p>
              )}
            </div>
          </motion.section>

          {/* Technologies */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6 mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground text-center">
              التقنيات العالمية
            </h2>
            {TECHNOLOGIES.map((t) => (
              <TechAccordion
                key={t.id}
                tech={t}
                expanded={expanded === t.id}
                onToggle={() => setExpanded(expanded === t.id ? null : t.id)}
              />
            ))}
          </motion.section>

          {/* CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
              <CardContent className="p-10 md:p-12">
                <h3 className="text-3xl font-bold mb-4 text-foreground">
                  اتصل بالشبكة العالمية
                </h3>
                <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-lg">
                  استكشف الفرص في سوق الاتصالات العالمية وابق في المقدمة مع
                  الابتكارات التكنولوجية التي تشكل عالمنا المتصل.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    تحليل السوق
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900"
                  >
                    اتجاهات التكنولوجيا
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-900"
                  >
                    فرص الاستثمار
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
