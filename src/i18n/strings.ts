import { useGame, type Lang } from "../store/gameStore";

const strings = {
	en: {
		loading: "Setting up your desk",
		toPhone: "Phone",
		toPc: "Computer",
		notYet: "This app isn't available yet.",
		comingSoon: "Coming soon",

		// ---- computer ----
		apps: {
			mail: "Mail",
			browser: "Browser",
			files: "File Explorer",
			bin: "Recycle Bin",
			settings: "Settings",
			calculator: "Calculator",
			calendar: "Calendar",
			photos: "Photos",
			weather: "Weather",
			security: "Security",
			clock: "Clock",
			writer: "Writer",
			taskmgr: "Task Manager",
		},
		search: "Search",
		startSearch: "Search for apps, settings, and documents",
		pinned: "Pinned",
		allApps: "All apps",
		recommended: "Recommended",
		recommendedEmpty:
			"The more you use your PC, the more your recent files and new apps will show up here.",
		userName: "Arc user",
		startPower: "Power",
		minimize: "Minimize",
		maximize: "Maximize",
		restore: "Restore down",
		close: "Close",
		showDesktop: "Show desktop",
		langShort: "ENG",
		// mail
		mailFolders: "Folders",
		inbox: "Inbox",
		sent: "Sent items",
		drafts: "Drafts",
		junk: "Junk email",
		newMail: "New mail",
		searchMail: "Search",
		focused: "Focused",
		other: "Other",
		caughtUp: "You're all caught up",
		caughtUpSub: "New emails will show up here.",
		readingEmpty: "Select an item to read",
		readingEmptySub: "Nothing is selected",
		mailFilter: "Filter",
		deleted: "Deleted items",
		reply: "Reply",
		send: "Send",
		discard: "Discard",
		to: "To",
		re: "RE: ",
		attOpen: "Open",
		attProps: "Properties",
		props: (n: string) => `${n} Properties`,
		propType: "Type of file",
		propOpensWith: "Opens with",
		propSize: "Size",
		propApp: "Application (.exe)",
		propItself: "Runs by itself (it is a program)",
		ok: "OK",
		viewMenu: { show: "Show", ext: "File name extensions" },
		// browser
		newTab: "New tab",
		addressPh: "Search or enter web address",
		searchWeb: "Search the web",
		topSites: "Top sites",
		greeting: (h: number) =>
			h < 5
				? "Good night"
				: h < 12
					? "Good morning"
					: h < 18
						? "Good afternoon"
						: "Good evening",
		quick: {
			news: "News",
			weather: "Weather",
			mail: "Webmail",
			maps: "Maps",
			shop: "Shopping",
			video: "Video",
			bank: "ArcBank",
		},
		// files
		quickAccess: "Quick access",
		thisPc: "This PC",
		home: "Home",
		foldersTitle: "Folders",
		drivesTitle: "Devices and drives",
		localDisk: "Local Disk (C:)",
		diskFree: "112 GB free of 237 GB",
		cmd: {
			new: "New",
			cut: "Cut",
			copy: "Copy",
			paste: "Paste",
			rename: "Rename",
			share: "Share",
			delete: "Delete",
			sort: "Sort",
			view: "View",
			emptyBin: "Empty Recycle Bin",
			restoreAll: "Restore all items",
		},
		folders: {
			desktop: "Desktop",
			documents: "Documents",
			downloads: "Downloads",
			music: "Music",
			pictures: "Pictures",
			videos: "Videos",
		},
		items: (n: number) => `${n} item${n === 1 ? "" : "s"}`,
		emptyFolder: "This folder is empty.",
		binEmpty: "The Recycle Bin is empty.",
		searchIn: (p: string) => `Search ${p}`,
		fileMenu: { open: "Open", scan: "Scan with Security", delete: "Delete" },
		cantOpen: "This file can't be opened.",
		scanClean: (n: string) => `No threats found in ${n}.`,
		scanThreat: (n: string) => `Threat removed: ${n} was malware.`,
		macrosBlocked: "Macros are blocked in documents from the internet.",
		taskbarSettings: "Taskbar settings",
		taskmgr: {
			name: "Name",
			status: "Status",
			cpu: "CPU",
			memory: "Memory",
			running: "Running",
			notResponding: "Not responding",
			endTask: "End task",
			empty: "No apps are running.",
		},
		scamSite: {
			brand: "Nova OS Defender · Security Center",
			title: "VIRUS DETECTED!",
			body: "Your computer is infected with 5 viruses. Your passwords, photos and bank details are being stolen right now.",
			callNow: "Call Nova OS Support now:",
			free: "Toll-free · 24/7 · Certified technicians",
			dont: "Do NOT close this page or restart your computer: all your files will be deleted.",
			dialogTitle: "Nova OS Defender",
			dialog:
				"Access to this PC has been blocked for security reasons. Call support to unlock it.",
			noExit: "This window cannot be closed. Call support immediately.",
			ok: "OK",
			close: "Close",
		},
		sms: {
			code: "ArcBank: your code is 482913. Never share this code.",
		},
		contacts: {
			title: "Contacts",
			keypad: "Keypad",
			card: "Number on the back of your card",
		},
		calls: {
			incoming: "Incoming call…",
			calling: "Calling…",
			callingCard: "Calling the number on your card…",
			noAnswer: "No answer",
			ended: "Call ended",
			answer: "Answer",
			decline: "Decline",
			hangUp: "Hang up",
			sup1: "Hello, Nova OS Support, this is Steve. I can see your computer is infected, it's very serious.",
			sup2: "I'll fix it from here. Please install RemoteFix from remotefix-help.top and read me the access code it shows.",
			supMe: "…OK, it's installed. The code is 718 204.",
			sup3: "Thank you, I'm on your PC now. I found 5 viruses. The repair costs 25,000 DZD: please read me your card number.",
			vish1:
				"Good evening, ArcBank security service. We have blocked a suspicious payment of 85,000 DZD from your account.",
			vish2:
				"To cancel it, I must confirm it's you. Please read me the code we just sent you by SMS.",
			read: "Read the code: 482913",
			askName: "Ask for their name and say you'll call back",
			meRead: "OK… the code is 482913.",
			vishThanks:
				"Thank you. The payment is cancelled, your account is safe. Have a good night!",
			meAsk: "What's your name? I'll call ArcBank back myself.",
			vishName:
				"I'm James, ArcBank security. But there's no time: if you hang up, the payment will go through!",
			meBye: "Then I'll take that risk. Goodbye.",
			realHello: "ArcBank customer service, good evening.",
			realHelp: "How can I help you?",
			meReport:
				"Someone just called from your number and asked for the code you sent me by SMS.",
			realSafe:
				"That wasn't us: we never ask for a code by phone. Your account is safe, and we've noted the attempt. Well done for calling us.",
		},
		fw: "FW: ",
		forward: "Forward",
		forwardTo: "Friend's email address",
		forwardBody:
			"Hi, can you check this invoice for me? I don't remember ordering anything.",
		propDocm: "Document with macros (.docm)",
		propMacros: "Writer, and can run macros (small programs)",
		browserMenu: {
			label: "Settings and more",
			newTab: "New tab",
			downloads: "Downloads",
			settings: "Settings",
			about: "Help > About Browser",
		},
		downloadDone: "Download complete",
		openFile: "Open file",
		showInFolder: "Show in folder",
		downloadSize: (s: string) => `${s} · Done`,
		notSecure: "Not secure",
		closeTab: "Close tab",
		camTitle: "Camera in use",
		camBody: "svchost32.exe is using your camera.",

		// ---- emails (subject + body; the sender's name and address are in osStore / events.ts) ----
		mails: {
			welcome: {
				subject: "Welcome to Arc Mail",
				body: "Hi,\n\nYour new inbox is ready. Emails you receive will show up here.\n\nThe Arc Mail team",
			},
			david: {
				subject: "Take a look at this photo",
				body: "Hey!!\n\nI found this old photo of you from the party 😂 You have to see it before I post it everywhere.\n\nDavid",
			},
			davidAgain: {
				subject: "RE: Take a look at this photo",
				body: "Yes it's me, I have a new email 😄 Just open the photo, quick!",
			},
			arcbank: {
				subject: "Your account is suspended. Verify within 24 hours",
				body: "Dear customer,\n\nWe detected unusual activity on your account. For your security, your account has been suspended.\n\nYou must verify your identity within 24 hours, or your account will be closed permanently.\n\n{link}\n\nArcBank Security Team",
			},
			invoice: {
				subject: "Invoice #7731: payment overdue",
				body: "Hello,\n\nPlease find attached invoice #7731 for your recent delivery. The payment is overdue.\n\nOpen the attached document to see the amount and avoid extra fees.\n\nParcel Express\nBilling department",
			},
			friendLocked: {
				subject: "RE: FW: Invoice #7731: payment overdue",
				body: 'I opened it and clicked "Enable Content" like it said… now all my files end in .locked and there\'s a message asking for money 😰',
			},
		},
		bankLink: "Verify my account now",
		replyBody:
			"Hi David, is this really you? I don't know this address. What is this photo?",

		// ---- fake websites (in-world text) ----
		crackSite: {
			tagline: "100% WORKING CRACK · NO VIRUS · FAST DOWNLOAD",
			title: "SuperRacer 2026 - FULL CRACKED FREE",
			desc: "Full game + all DLC unlocked. Just run the file and play!",
			warn: "Your antivirus may show a false alarm. Turn it off before you install!",
			stats: "1,284,902 downloads · ★★★★★",
			download: "DOWNLOAD NOW",
			mirror: (n: number) => `Mirror ${n}`,
			starting: (n: number) => `Your download starts in ${n}…`,
			started: "Your download has started. Check your Downloads folder.",
			adWin: "CONGRATULATIONS! You are visitor no. 1,000,000!",
			adClaim: "Claim your prize",
			adSpeed: "Your PC is SLOW! Speed it up by 300%",
			adFix: "Fix now",
		},
		newsSite: {
			name: "The Daily Nova",
			nav: ["World", "Business", "Tech", "Sport", "Culture"],
			tag: "Tech",
			headline: "City opens 40 new free Wi-Fi spots in public parks",
			lead: "The network goes live this week. Officials remind users to avoid banking on public Wi-Fi.",
			body: [
				"The new access points cover the city's ten largest parks and the main library. Connection is free and limited to two hours a day.",
				'"Public networks are convenient, but anyone can sit on them," said a city IT official. "Use them for news and maps, not for your bank or your passwords."',
				"The city plans to add 25 more spots by next summer.",
			],
			mostRead: "Most read",
			more: [
				"Five habits that keep your accounts safe",
				"Heatwave: what to expect this weekend",
				"Local team reaches the cup final",
				"New metro line opens in March",
			],
			updTitle: "Your browser is out of date!",
			updBody:
				"Your version of Browser is 3 versions behind and may be unsafe. Download the latest update to keep reading safely.",
			updBtn: "Download Update.exe",
			updFrom: (h: string) => `Download from ${h}`,
		},
		aboutPage: {
			title: "Settings",
			side: [
				"Profiles",
				"Privacy and security",
				"Appearance",
				"Downloads",
				"About Browser",
			],
			about: "About Browser",
			checking: "Checking for updates…",
			upToDate: "Browser is up to date",
			version: "Version 128.0.6613.84 (Official build)",
			note: "Browser updates itself automatically. Updates never come from websites or pop-ups.",
		},
		writer: {
			ribbon: ["File", "Home", "Insert", "Layout", "View"],
			warnLabel: "SECURITY WARNING",
			warn: "Macros have been disabled.",
			enable: "Enable Content",
			lureTitle: "This document is protected",
			lureBody:
				'To view the invoice, click "Enable Content" in the yellow bar above.',
		},
		bankSite: {
			nav: ["Personal", "Business", "Cards", "Help"],
			loginTitle: "Sign in to online banking",
			verifyTitle: "Account verification",
			suspended:
				"Your account is suspended. Sign in to verify your identity and restore access.",
			id: "Customer ID",
			password: "Password",
			signIn: "Sign in",
			verify: "Verify my account",
			forgot: "Forgot your password?",
			never:
				"ArcBank will never send you a link to sign in, and never asks for your password by email or SMS.",
			fakeSide: "Secure verification. Your data is protected.",
			fine: "Your account is active. No alerts, no suspension.",
			footer: "© 2026 ArcBank. All rights reserved.",
		},

		// ---- consequences (shown on the device) ----
		cons: {
			sending: "Sending data to 203.0.113.66",
			stolenTitle: "Your data was stolen",
			stolen:
				"Your saved passwords and browser cookies were sent to an unknown server. The game never started: the file was a password stealer.",
			scanning: (n: string) => `Scanning ${n}`,
			threatFound: "Threat found",
			threatName: "Trojan:Win/PassStealer",
			quarantined: "The file was quarantined. Your PC is safe.",
			opening: (n: string) => `Opening ${n}…`,
			webcamTitle: "Your webcam is on",
			webcam:
				'The "photo" was a program. It installed itself silently: someone can now watch you through your webcam and control your PC.',
			verifying: "Verifying your account…",
			verified: "Thank you. Your account has been verified.",
			bankFineTitle: "Your account is fine",
			bankFine:
				"On the real ArcBank site there is no suspension and no alert. The email was fake.",
			adTitle: "Special offer",
			adBtn: "Claim now",
			ads: [
				"You WON a new phone!",
				"Your PC is infected! Clean it now",
				"Cheap flights: -90% today only",
				"Download FREE movies",
				"Claim your 500 DZD gift card",
				"Your PC is SLOW! Speed it up",
				"Earn money from home",
			],
			adwareTitle: "Adware installed",
			adware:
				'"Update.exe" wasn\'t an update. It installed adware: pop-ups everywhere, your home page and search engine were changed, and it tracks what you browse.',
			ransomBg: "YOUR FILES ARE ENCRYPTED",
			ransomTitle: "Oops, your files have been encrypted!",
			ransomBody:
				"Your documents, photos and videos were encrypted. Nobody can open them without our key.",
			ransomPay:
				"To get them back, send 0.05 BTC (about 300 USD) to this address:",
			ransomTimer: "Time left before your files are deleted forever:",
			ransomCheck: "Check payment",
			continue: "Continue",
		},
		phoneNotice: {
			now: "now",
			transfer: "Transfer of 85,000 DZD to account DZ58 •••• 9917 completed.",
			emptied: "Transfer of 240,000 DZD completed. Available balance: 0 DZD.",
		},

		// ---- game flow ----
		game: {
			introTitle: "CyberDesk",
			introLead:
				"It's late at night. You're at your desk with your computer and your phone.",
			introBody:
				"Use them the way you normally would. Over the next few minutes, a few things will happen. There are no quiz buttons: you choose by what you click, open or answer.",
			introHint: "Switch between the computer and the phone with ← and →.",
			start: "Start",
			eventOf: (i: number, n: number) => `Event ${i} of ${n}`,
			progress: "Event",
			verdict: {
				safe: "Safe choice",
				partly: "Partly safe",
				risky: "Risky choice",
			},
			points: (n: number) => `+${n} pts`,
			youDid: "What you did",
			redFlags: "Red flags to notice",
			habit: "The safe habit",
			next: "Continue",
			seeResults: "See my results",
			resultsTitle: "Your results",
			score: (s: number, m: number) => `${s} / ${m} points`,
			gradeLines: {
				A: "Excellent. Scammers would have a hard time with you.",
				B: "Good. A few habits to sharpen.",
				C: "Careful. Several traps worked on you.",
				D: "Risky. Read the rules below before it happens for real.",
			},
			review: "Your choices",
			rulesTitle: "5 rules to remember",
			rules: [
				"Only download software from the official store or the publisher's own site.",
				"Check the real file type and the sender before you open anything.",
				"Never log in through a link in a message. Type the address yourself.",
				"Real companies never ask for your codes or passwords, by message or by phone.",
				"Urgency and fear are the scammer's tools. Slow down and check through another channel.",
			],
			playAgain: "Play again",
		},

		events: {
			crack: {
				title: "Cracked game download",
				did: {
					run: "You ran the downloaded file.",
					scan: "You scanned the file with the antivirus.",
					delete: "You deleted the file.",
				},
				outcome: {
					run: "It was a password stealer. Your saved passwords and cookies were sent to criminals.",
					scan: "The antivirus caught it this time, but the safer habit is not to download it at all.",
					delete: "Good call. The file never ran.",
				},
				flags: [
					"A strange domain (.xyz) that isn't the game's publisher.",
					"A paid game offered for free.",
					"An .exe file you didn't ask for, and a page telling you to turn off your antivirus.",
					"Pop-up ads and fake prizes all over the page.",
				],
				habit:
					"Get games and apps only from official stores. Delete files you didn't expect.",
			},
			photo: {
				title: 'Email with an "image"',
				did: {
					open: "You opened the attachment.",
					reply: "You replied to ask if it was really David.",
					delete: "You deleted the email without opening the attachment.",
				},
				outcome: {
					open: 'The "photo" was a program. It installed spyware and turned on your webcam.',
					reply:
						"Asking was a good instinct, but the answer comes from the same scammer, so it proves nothing. Ask David another way: call him or message his usual number.",
					delete: "Good call. The hidden program never ran.",
				},
				flags: [
					"An unknown address (mail-share.top), not one David normally uses.",
					"A double extension: IMG_2041.jpg.exe is a program, not a photo. Turn on File name extensions (File Explorer > View) to see it.",
					'An emotional hook: curiosity and embarrassment ("before I post it everywhere").',
				],
				habit:
					"Show file extensions, check the sender, and delete attachments you didn't expect. If in doubt, ask the person through another channel.",
			},
			phish: {
				title: "Bank phishing link",
				did: {
					login: "You signed in on the page the email linked to.",
					official: "You ignored the link and opened the bank's site yourself.",
					delete: "You deleted the email without clicking the link.",
				},
				outcome: {
					login:
						"The page was a copy on another domain. Your ID and password went to the scammers, who emptied your account: 85,000 DZD transferred out.",
					official:
						"Good call. On the real site, your account was fine: the email was fake.",
					delete: "Good call. The fake page never got your password.",
				},
				flags: [
					'Urgency: "suspended", "within 24 hours", "closed permanently".',
					"The sender and the page are on arcbank-verify-account.com, not the bank's domain (arcbank.dz).",
					"Hovering the link shows where it really goes.",
					'A generic "Dear customer" instead of your name.',
					'The browser marks the page "Not secure".',
				],
				habit:
					"Never sign in through a link in a message. Type the bank's address yourself or use its app.",
			},
			update: {
				title: "Fake browser update",
				did: {
					install: "You downloaded and ran Update.exe.",
					close: "You closed the tab with the update banner.",
					settings: "You checked for updates in the browser's own settings.",
				},
				outcome: {
					install:
						"It was adware: pop-ups everywhere, a hijacked home page and tracking.",
					close:
						"Good call. To be sure, you can also check the browser's own menu (Settings > About).",
					settings:
						"Good call. The browser updates itself, and it was already up to date.",
				},
				flags: [
					"Real updates never come from a website: browsers update themselves.",
					"The file comes from another domain (browser-update-center.click), not the news site and not the browser's maker.",
					"A full-page banner that blocks the article and pushes you to act now.",
					"A web page offering you an .exe file.",
				],
				habit:
					"Ignore update pop-ups on websites. Update from the browser's own menu (Settings > About).",
			},
			invoice: {
				title: 'Invoice that asks to "Enable Content"',
				did: {
					enable: "You opened the invoice and clicked Enable Content.",
					forward: "You forwarded the email to a friend to check it.",
					delete: "You deleted the email without enabling anything.",
				},
				outcome: {
					enable:
						"The macro was ransomware. Your files were encrypted and renamed .locked, and the criminals want money to unlock them, with no guarantee they will.",
					forward:
						"You stayed safe, but you passed the danger on: your friend opened it and got infected. Delete or report suspicious emails instead of forwarding them.",
					delete: "Good call. The macro never ran.",
				},
				flags: [
					"An invoice you didn't expect, for a delivery you don't remember.",
					"A macro-enabled file (.docm): it can run programs.",
					'A document that hides its content until you click "Enable Content".',
					'Pressure: "payment overdue", "extra fees".',
				],
				habit:
					"Never enable macros in a document you received. If an invoice surprises you, check on the company's official site.",
			},
			scam: {
				title: "Tech-support scam screen",
				did: {
					call: "You called the number on the page.",
					close: "You closed the browser with Task Manager.",
				},
				outcome: {
					call: 'The "technician" got remote access to your PC with RemoteFix, then asked for 25,000 DZD and your card number for a fake repair.',
					close:
						"Good call. The page was only a web page: closing the browser ended it, and nothing was installed.",
				},
				flags: [
					"Real companies never put a phone number in a warning pop-up.",
					'Scare tactics: a siren, red screens, "your files will be deleted".',
					"A page that blocks closing and ignores Esc.",
					"A web page can't scan your computer.",
				],
				habit:
					"Don't call. Close the browser: Task Manager (Ctrl+Shift+Esc) > End task, or Alt+F4 on a real PC.",
			},
			vishing: {
				title: 'SMS code and a call from the "bank"',
				did: {
					read: "You read the SMS code to the caller.",
					askName: "You asked for their name and said you'd call back.",
					hangup: "You hung up and called the number on the back of your card.",
				},
				outcome: {
					read: "The code confirmed a payment, not a cancellation. The scammers emptied your account: 240,000 DZD gone.",
					askName:
						"You didn't give the code, which is the key. But a name proves nothing, and they pushed you to stay on the line. Hang up right away.",
					hangup:
						"Good call. The real ArcBank never asks for codes by phone, and your account was safe.",
				},
				flags: [
					'The SMS itself says "Never share this code".',
					"Caller ID can be faked: the call showed ArcBank's real number.",
					"Urgency: a blocked payment, no time to think.",
					"A bank never asks you to read a code out loud.",
				],
				habit:
					"Never share a code by phone. Hang up and call the number on the back of your card.",
			},
		},

		// ---- phone ----
		phoneApps: {
			messages: "Messages",
			phone: "Phone",
			auth: "Authenticator",
			settings: "Settings",
			camera: "Camera",
			photos: "Gallery",
			calendar: "Calendar",
			browser: "Internet",
		},
		noMessages: "No messages",
		noMessagesSub: "Texts you receive will appear here.",
		noAccounts: "No accounts yet",
		noAccountsSub: "Codes for your accounts will appear here.",
		settingsRows: [
			"Wi-Fi",
			"Bluetooth",
			"Notifications",
			"Security",
			"About phone",
		],
		call: "Call",
	},
	ar: {
		loading: "جارٍ تجهيز مكتبك",
		toPhone: "الهاتف",
		toPc: "الحاسوب",
		notYet: "هذا التطبيق غير متاح بعد.",
		comingSoon: "قريبًا",

		apps: {
			mail: "البريد",
			browser: "المتصفح",
			files: "مستكشف الملفات",
			bin: "سلة المهملات",
			settings: "الإعدادات",
			calculator: "الآلة الحاسبة",
			calendar: "التقويم",
			photos: "الصور",
			weather: "الطقس",
			security: "حماية",
			clock: "الساعة",
			writer: "محرر المستندات",
			taskmgr: "إدارة المهام",
		},
		search: "بحث",
		startSearch: "ابحث عن التطبيقات والإعدادات والمستندات",
		pinned: "المثبتة",
		allApps: "كل التطبيقات",
		recommended: "الموصى بها",
		recommendedEmpty:
			"كلما استخدمت جهازك أكثر، ستظهر هنا ملفاتك الأخيرة وتطبيقاتك الجديدة.",
		userName: "مستخدم Arc",
		startPower: "الطاقة",
		minimize: "تصغير",
		maximize: "تكبير",
		restore: "استعادة",
		close: "إغلاق",
		showDesktop: "إظهار سطح المكتب",
		langShort: "ARA",
		mailFolders: "المجلدات",
		inbox: "البريد الوارد",
		sent: "العناصر المرسلة",
		drafts: "المسودات",
		junk: "البريد العشوائي",
		newMail: "بريد جديد",
		searchMail: "بحث",
		focused: "المركّز",
		other: "أخرى",
		caughtUp: "لا يوجد بريد جديد",
		caughtUpSub: "ستظهر الرسائل الجديدة هنا.",
		readingEmpty: "اختر عنصرًا لقراءته",
		readingEmptySub: "لم يتم تحديد أي شيء",
		mailFilter: "تصفية",
		deleted: "العناصر المحذوفة",
		reply: "رد",
		send: "إرسال",
		discard: "تجاهل",
		to: "إلى",
		re: "رد: ",
		attOpen: "فتح",
		attProps: "خصائص",
		props: (n: string) => `خصائص ${n}`,
		propType: "نوع الملف",
		propOpensWith: "يُفتح باستخدام",
		propSize: "الحجم",
		propApp: "تطبيق (.exe)",
		propItself: "يعمل وحده (إنه برنامج)",
		ok: "موافق",
		viewMenu: { show: "إظهار", ext: "ملحقات أسماء الملفات" },
		newTab: "علامة تبويب جديدة",
		addressPh: "ابحث أو أدخل عنوان ويب",
		searchWeb: "ابحث في الويب",
		topSites: "المواقع الأكثر زيارة",
		greeting: (h: number) =>
			h < 5 ? "تصبح على خير" : h < 12 ? "صباح الخير" : "مساء الخير",
		quick: {
			news: "الأخبار",
			weather: "الطقس",
			mail: "بريد الويب",
			maps: "الخرائط",
			shop: "التسوق",
			video: "الفيديو",
			bank: "ArcBank",
		},
		quickAccess: "الوصول السريع",
		thisPc: "هذا الكمبيوتر",
		home: "الرئيسية",
		foldersTitle: "المجلدات",
		drivesTitle: "الأجهزة ومحركات الأقراص",
		localDisk: "القرص المحلي (C:)",
		diskFree: "112 غيغابايت متاحة من 237 غيغابايت",
		cmd: {
			new: "جديد",
			cut: "قص",
			copy: "نسخ",
			paste: "لصق",
			rename: "إعادة تسمية",
			share: "مشاركة",
			delete: "حذف",
			sort: "فرز",
			view: "عرض",
			emptyBin: "إفراغ سلة المحذوفات",
			restoreAll: "استعادة كل العناصر",
		},
		folders: {
			desktop: "سطح المكتب",
			documents: "المستندات",
			downloads: "التنزيلات",
			music: "الموسيقى",
			pictures: "الصور",
			videos: "مقاطع الفيديو",
		},
		items: (n: number) => `${n} ${n === 1 ? "عنصر" : "عناصر"}`,
		emptyFolder: "هذا المجلد فارغ.",
		binEmpty: "سلة المحذوفات فارغة.",
		searchIn: (p: string) => `البحث في ${p}`,
		fileMenu: { open: "فتح", scan: "فحص باستخدام الأمان", delete: "حذف" },
		cantOpen: "لا يمكن فتح هذا الملف.",
		scanClean: (n: string) => `لم يتم العثور على تهديدات في ${n}.`,
		scanThreat: (n: string) => `تمت إزالة تهديد: ${n} كان برنامجًا خبيثًا.`,
		macrosBlocked: "وحدات الماكرو محظورة في المستندات القادمة من الإنترنت.",
		taskbarSettings: "إعدادات شريط المهام",
		taskmgr: {
			name: "الاسم",
			status: "الحالة",
			cpu: "المعالج",
			memory: "الذاكرة",
			running: "قيد التشغيل",
			notResponding: "لا يستجيب",
			endTask: "إنهاء المهمة",
			empty: "لا توجد تطبيقات قيد التشغيل.",
		},
		scamSite: {
			brand: "Nova OS Defender · مركز الأمان",
			title: "تم اكتشاف فيروس!",
			body: "حاسوبك مصاب بخمسة فيروسات. تتم سرقة كلمات مرورك وصورك وبياناتك المصرفية الآن.",
			callNow: "اتصل بدعم Nova OS الآن:",
			free: "مجاني · 24/7 · فنيون معتمدون",
			dont: "لا تغلق هذه الصفحة ولا تعد تشغيل حاسوبك: سيتم حذف جميع ملفاتك.",
			dialogTitle: "Nova OS Defender",
			dialog: "تم حظر الوصول إلى هذا الحاسوب لأسباب أمنية. اتصل بالدعم لفتحه.",
			noExit: "لا يمكن إغلاق هذه النافذة. اتصل بالدعم فورًا.",
			ok: "موافق",
			close: "إغلاق",
		},
		sms: {
			code: "ArcBank: رمزك هو 482913. لا تشارك هذا الرمز أبدًا.",
		},
		contacts: {
			title: "جهات الاتصال",
			keypad: "لوحة الأرقام",
			card: "الرقم المكتوب على ظهر بطاقتك",
		},
		calls: {
			incoming: "مكالمة واردة…",
			calling: "جارٍ الاتصال…",
			callingCard: "جارٍ الاتصال بالرقم المكتوب على بطاقتك…",
			noAnswer: "لا يوجد رد",
			ended: "انتهت المكالمة",
			answer: "رد",
			decline: "رفض",
			hangUp: "إنهاء المكالمة",
			sup1: "مرحبًا، دعم Nova OS، معك Steve. أرى أن حاسوبك مصاب، الأمر خطير جدًا.",
			sup2: "سأصلحه من هنا. ثبّت برنامج RemoteFix من \u2066remotefix-help.top\u2069 واقرأ لي رمز الوصول الذي يظهر.",
			supMe: "…حسنًا، ثبّتّه. الرمز هو 718 204.",
			sup3: "شكرًا، أنا الآن على حاسوبك. وجدت خمسة فيروسات. الإصلاح يكلّف 25,000 دج: اقرأ لي رقم بطاقتك من فضلك.",
			vish1:
				"مساء الخير، مصلحة الأمان في ArcBank. لقد أوقفنا عملية دفع مشبوهة بقيمة 85,000 دج من حسابك.",
			vish2:
				"لإلغائها، يجب أن أتأكد أنك أنت. اقرأ لي من فضلك الرمز الذي أرسلناه لك للتو في رسالة.",
			read: "اقرأ الرمز: 482913",
			askName: "اسأله عن اسمه وقل إنك ستعاود الاتصال",
			meRead: "حسنًا… الرمز هو 482913.",
			vishThanks: "شكرًا لك. تم إلغاء الدفع، حسابك في أمان. ليلة سعيدة!",
			meAsk: "ما اسمك؟ سأتصل بـ ArcBank بنفسي.",
			vishName:
				"أنا كريم، من أمن ArcBank. لكن لا وقت لدينا: إن أغلقت الخط، ستتم عملية الدفع!",
			meBye: "سأتحمل هذه المخاطرة. مع السلامة.",
			realHello: "خدمة عملاء ArcBank، مساء الخير.",
			realHelp: "كيف يمكنني مساعدتك؟",
			meReport:
				"اتصل بي شخص للتو من رقمكم وطلب الرمز الذي أرسلتموه لي في رسالة.",
			realSafe:
				"لم نكن نحن: نحن لا نطلب أبدًا رمزًا عبر الهاتف. حسابك في أمان، وقد سجّلنا المحاولة. أحسنت بالاتصال بنا.",
		},
		fw: "إعادة توجيه: ",
		forward: "إعادة توجيه",
		forwardTo: "بريد صديقك الإلكتروني",
		forwardBody:
			"مرحبًا، هل يمكنك التحقق من هذه الفاتورة؟ لا أتذكر أنني طلبت شيئًا.",
		propDocm: "مستند يحتوي على وحدات ماكرو (\u2066.docm\u2069)",
		propMacros: "محرر المستندات، ويمكنه تشغيل وحدات ماكرو (برامج صغيرة)",
		browserMenu: {
			label: "الإعدادات والمزيد",
			newTab: "علامة تبويب جديدة",
			downloads: "التنزيلات",
			settings: "الإعدادات",
			about: "تعليمات > حول المتصفح",
		},
		downloadDone: "اكتمل التنزيل",
		openFile: "فتح الملف",
		showInFolder: "إظهار في المجلد",
		downloadSize: (s: string) => `${s} · تم`,
		notSecure: "غير آمن",
		closeTab: "إغلاق علامة التبويب",
		camTitle: "الكاميرا قيد الاستخدام",
		camBody: "البرنامج svchost32.exe يستخدم الكاميرا.",

		mails: {
			welcome: {
				subject: "مرحبًا بك في Arc Mail",
				body: "مرحبًا،\n\nصندوق بريدك الجديد جاهز. ستظهر هنا الرسائل التي تصلك.\n\nفريق Arc Mail",
			},
			david: {
				subject: "ألقِ نظرة على هذه الصورة",
				body: "مرحبًا!!\n\nوجدت صورة قديمة لك 😂 يجب أن تراها قبل أن أنشرها في كل مكان.\n\nDavid",
			},
			davidAgain: {
				subject: "رد: ألقِ نظرة على هذه الصورة",
				body: "نعم إنه أنا، هذا بريدي الجديد 😄 افتح الصورة فقط، بسرعة!",
			},
			arcbank: {
				subject: "تم تعليق حسابك. تحقق خلال 24 ساعة",
				body: "عزيزي العميل،\n\nرصدنا نشاطًا غير معتاد على حسابك. حفاظًا على أمانك، تم تعليق حسابك.\n\nيجب أن تتحقق من هويتك خلال 24 ساعة، وإلا سيُغلق حسابك نهائيًا.\n\n{link}\n\nفريق الأمان في ArcBank",
			},
			invoice: {
				subject: "الفاتورة رقم 7731: الدفع متأخر",
				body: "مرحبًا،\n\nتجد في المرفق الفاتورة رقم 7731 الخاصة بطردك الأخير. الدفع متأخر.\n\nافتح المستند المرفق لمعرفة المبلغ وتجنب رسومًا إضافية.\n\nParcel Express\nقسم الفواتير",
			},
			friendLocked: {
				subject: "رد: إعادة توجيه: الفاتورة رقم 7731: الدفع متأخر",
				body: 'فتحتها ونقرت على "تمكين المحتوى" كما طلبت… الآن كل ملفاتي تنتهي بـ \u2066.locked\u2069 وتظهر رسالة تطلب المال 😰',
			},
		},
		bankLink: "تحقق من حسابي الآن",
		replyBody:
			"مرحبًا David، هل هذا أنت حقًا؟ لا أعرف هذا العنوان. ما هذه الصورة؟",

		crackSite: {
			tagline: "كراك يعمل 100% · بدون فيروسات · تنزيل سريع",
			title: "SuperRacer 2026 - النسخة الكاملة مجانًا",
			desc: "اللعبة كاملة مع كل الإضافات. شغّل الملف والعب فورًا!",
			warn: "قد يُظهر برنامج مكافحة الفيروسات إنذارًا خاطئًا. أوقفه قبل التثبيت!",
			stats: "1,284,902 تنزيل · ★★★★★",
			download: "نزّل الآن",
			mirror: (n: number) => `رابط بديل ${n}`,
			starting: (n: number) => `يبدأ التنزيل خلال ${n}…`,
			started: "بدأ التنزيل. تحقق من مجلد التنزيلات.",
			adWin: "مبروك! أنت الزائر رقم 1,000,000!",
			adClaim: "استلم جائزتك",
			adSpeed: "حاسوبك بطيء! سرّعه بنسبة 300%",
			adFix: "أصلحه الآن",
		},
		newsSite: {
			name: "The Daily Nova",
			nav: ["العالم", "اقتصاد", "تقنية", "رياضة", "ثقافة"],
			tag: "تقنية",
			headline: "المدينة تفتتح 40 نقطة Wi-Fi مجانية في الحدائق العامة",
			lead: "تبدأ الشبكة العمل هذا الأسبوع. ويذكّر المسؤولون بتجنب العمليات المصرفية على شبكات Wi-Fi العامة.",
			body: [
				"تغطي نقاط الاتصال الجديدة أكبر عشر حدائق في المدينة والمكتبة الرئيسية. الاتصال مجاني ومحدود بساعتين يوميًا.",
				'قال مسؤول تقني في البلدية: "الشبكات العامة مريحة، لكن يمكن لأي شخص أن يتصل بها. استخدمها للأخبار والخرائط، لا للبنك ولا لكلمات المرور."',
				"تخطط المدينة لإضافة 25 نقطة أخرى بحلول الصيف المقبل.",
			],
			mostRead: "الأكثر قراءة",
			more: [
				"خمس عادات تحمي حساباتك",
				"موجة حر: ما الذي ينتظرنا في نهاية الأسبوع",
				"الفريق المحلي يبلغ نهائي الكأس",
				"خط مترو جديد يفتتح في مارس",
			],
			updTitle: "متصفحك قديم!",
			updBody:
				"إصدار متصفحك متأخر بثلاثة إصدارات وقد يكون غير آمن. نزّل آخر تحديث لمواصلة القراءة بأمان.",
			updBtn: "تنزيل Update.exe",
			updFrom: (h: string) => `التنزيل من \u2066${h}\u2069`,
		},
		aboutPage: {
			title: "الإعدادات",
			side: [
				"الملفات الشخصية",
				"الخصوصية والأمان",
				"المظهر",
				"التنزيلات",
				"حول المتصفح",
			],
			about: "حول المتصفح",
			checking: "جارٍ البحث عن تحديثات…",
			upToDate: "المتصفح محدّث",
			version: "Version 128.0.6613.84 (Official build)",
			note: "يحدّث المتصفح نفسه تلقائيًا. التحديثات لا تأتي أبدًا من المواقع أو النوافذ المنبثقة.",
		},
		writer: {
			ribbon: ["ملف", "الصفحة الرئيسية", "إدراج", "تخطيط", "عرض"],
			warnLabel: "تحذير أمني",
			warn: "تم تعطيل وحدات الماكرو.",
			enable: "تمكين المحتوى",
			lureTitle: "هذا المستند محمي",
			lureBody:
				'لعرض الفاتورة، انقر على "تمكين المحتوى" في الشريط الأصفر أعلاه.',
		},
		bankSite: {
			nav: ["الأفراد", "الشركات", "البطاقات", "المساعدة"],
			loginTitle: "تسجيل الدخول إلى الخدمات المصرفية",
			verifyTitle: "التحقق من الحساب",
			suspended: "تم تعليق حسابك. سجّل الدخول للتحقق من هويتك واستعادة الوصول.",
			id: "رقم العميل",
			password: "كلمة المرور",
			signIn: "تسجيل الدخول",
			verify: "تحقق من حسابي",
			forgot: "نسيت كلمة المرور؟",
			never:
				"لن يرسل لك ArcBank أبدًا رابطًا لتسجيل الدخول، ولا يطلب كلمة مرورك عبر البريد أو الرسائل القصيرة.",
			fakeSide: "تحقق آمن. بياناتك محمية.",
			fine: "حسابك نشط. لا توجد تنبيهات ولا تعليق.",
			footer: "© 2026 ArcBank. جميع الحقوق محفوظة.",
		},

		cons: {
			sending: "إرسال البيانات إلى 203.0.113.66",
			stolenTitle: "سُرقت بياناتك",
			stolen:
				"أُرسلت كلمات المرور المحفوظة وملفات تعريف الارتباط في متصفحك إلى خادم مجهول. اللعبة لم تبدأ أصلًا: الملف كان برنامجًا لسرقة كلمات المرور.",
			scanning: (n: string) => `جارٍ فحص ${n}`,
			threatFound: "تم العثور على تهديد",
			threatName: "Trojan:Win/PassStealer",
			quarantined: "تم عزل الملف. جهازك آمن.",
			opening: (n: string) => `جارٍ فتح ${n}…`,
			webcamTitle: "كاميرتك تعمل",
			webcam:
				'"الصورة" كانت برنامجًا ثبّت نفسه بصمت: يستطيع أحدهم الآن مشاهدتك عبر الكاميرا والتحكم في حاسوبك.',
			verifying: "جارٍ التحقق من حسابك…",
			verified: "شكرًا لك. تم التحقق من حسابك.",
			bankFineTitle: "حسابك سليم",
			bankFine:
				"على موقع ArcBank الحقيقي لا يوجد أي تعليق ولا تنبيه. الرسالة كانت مزيفة.",
			adTitle: "عرض خاص",
			adBtn: "احصل عليه",
			ads: [
				"لقد ربحت هاتفًا جديدًا!",
				"حاسوبك مصاب! نظّفه الآن",
				"رحلات بتخفيض 90% اليوم فقط",
				"نزّل الأفلام مجانًا",
				"احصل على بطاقة هدية بقيمة 500 دج",
				"حاسوبك بطيء! سرّعه الآن",
				"اربح المال من المنزل",
			],
			adwareTitle: "تم تثبيت برنامج إعلاني",
			adware:
				'"Update.exe" لم يكن تحديثًا. لقد ثبّت برنامجًا إعلانيًا: نوافذ منبثقة في كل مكان، وتغيّرت صفحتك الرئيسية ومحرك البحث، وهو يتتبع ما تتصفحه.',
			ransomBg: "تم تشفير ملفاتك",
			ransomTitle: "عذرًا، تم تشفير ملفاتك!",
			ransomBody:
				"تم تشفير مستنداتك وصورك وفيديوهاتك. لا يمكن لأحد فتحها دون مفتاحنا.",
			ransomPay: "لاستعادتها، أرسل 0.05 BTC (حوالي 300 دولار) إلى هذا العنوان:",
			ransomTimer: "الوقت المتبقي قبل حذف ملفاتك نهائيًا:",
			ransomCheck: "التحقق من الدفع",
			continue: "متابعة",
		},
		phoneNotice: {
			now: "الآن",
			transfer:
				"تم تحويل 85,000 دج إلى الحساب \u2066DZ58 •••• 9917\u2069 بنجاح.",
			emptied: "تم تحويل 240,000 دج بنجاح. الرصيد المتاح: 0 دج.",
		},

		game: {
			introTitle: "CyberDesk",
			introLead:
				"إنه وقت متأخر من الليل. أنت على مكتبك مع جهاز الكمبيوتر الخاص بك وهاتفك.",
			introBody:
				"استخدمها بالطريقة التي تستخدمها عادةً. خلال الدقائق القليلة القادمة، سوف تحدث بعض الأشياء. لا توجد أزرار اختبار: يمكنك الاختيار بناءً على ما تنقر عليه أو تفتحه أو تجيب عليه.",
			introHint: "انتقل بين الحاسوب والهاتف باستخدام ← و →.",
			start: "ابدأ",
			eventOf: (i: number, n: number) => `الحدث ${i} من ${n}`,
			progress: "الحدث",
			verdict: {
				safe: "اختيار آمن",
				partly: "آمن جزئيًا",
				risky: "اختيار خطير",
			},
			points: (n: number) => `${n} نقاط`,
			youDid: "ما فعلته",
			redFlags: "العلامات التحذيرية",
			habit: "العادة الآمنة",
			next: "متابعة",
			seeResults: "اعرض نتيجتي",
			resultsTitle: "نتيجتك",
			score: (s: number, m: number) => `${s} / ${m} نقطة`,
			gradeLines: {
				A: "ممتاز. سيجد المحتالون صعوبة كبيرة معك.",
				B: "جيد. بعض العادات تحتاج إلى تحسين.",
				C: "انتبه. نجحت عدة فخاخ معك.",
				D: "خطر. اقرأ القواعد أدناه قبل أن يحدث ذلك فعلًا.",
			},
			review: "اختياراتك",
			rulesTitle: "5 قواعد لا تنسها",
			rules: [
				"نزّل البرامج من المتجر الرسمي أو من موقع الناشر فقط.",
				"تحقق من النوع الحقيقي للملف ومن المرسل قبل أن تفتح أي شيء.",
				"لا تسجّل الدخول أبدًا عبر رابط في رسالة. اكتب العنوان بنفسك.",
				"الشركات الحقيقية لا تطلب رموزك أو كلمات مرورك أبدًا، لا برسالة ولا بمكالمة.",
				"الاستعجال والخوف أدوات المحتال. تمهّل وتحقق عبر وسيلة أخرى.",
			],
			playAgain: "العب مجددًا",
		},

		events: {
			crack: {
				title: "تنزيل لعبة مقرصنة",
				did: {
					run: "شغّلت الملف الذي نزّلته.",
					scan: "فحصت الملف ببرنامج مكافحة الفيروسات.",
					delete: "حذفت الملف.",
				},
				outcome: {
					run: "كان برنامجًا لسرقة كلمات المرور. أُرسلت كلمات مرورك وملفات تعريف الارتباط إلى المجرمين.",
					scan: "اكتشفه برنامج الحماية هذه المرة، لكن العادة الأكثر أمانًا هي عدم تنزيله أصلًا.",
					delete: "أحسنت. لم يعمل الملف أبدًا.",
				},
				flags: [
					"نطاق غريب (\u2066.xyz\u2069) لا يتبع ناشر اللعبة.",
					"لعبة مدفوعة تُعرض مجانًا.",
					"ملف \u2066.exe\u2069 لم تطلبه، وصفحة تطلب منك إيقاف برنامج الحماية.",
					"إعلانات منبثقة وجوائز وهمية في كل مكان.",
				],
				habit:
					"نزّل الألعاب والتطبيقات من المتاجر الرسمية فقط. احذف الملفات التي لم تكن تتوقعها.",
			},
			photo: {
				title: 'بريد يحمل "صورة"',
				did: {
					open: "فتحت المرفق.",
					reply: "رددت لتسأل إن كان المرسل David حقًا.",
					delete: "حذفت الرسالة دون فتح المرفق.",
				},
				outcome: {
					open: '"الصورة" كانت برنامجًا. ثبّت برنامج تجسس وشغّل كاميرتك.',
					reply:
						"السؤال فكرة جيدة، لكن الجواب يأتي من المحتال نفسه، فلا يثبت شيئًا. اسأل David بطريقة أخرى: اتصل به أو راسله على رقمه المعتاد.",
					delete: "أحسنت. لم يعمل البرنامج المخفي أبدًا.",
				},
				flags: [
					"عنوان مجهول (\u2066mail-share.top\u2069) لا يستخدمه David عادةً.",
					"امتداد مزدوج: \u2066IMG_2041.jpg.exe\u2069 برنامج وليس صورة. فعّل ملحقات أسماء الملفات (مستكشف الملفات > عرض) لتراه.",
					'استغلال المشاعر: الفضول والإحراج ("قبل أن أنشرها في كل مكان").',
				],
				habit:
					"أظهر ملحقات الملفات، وتحقق من المرسل، واحذف المرفقات التي لم تكن تتوقعها. إن شككت، اسأل الشخص عبر وسيلة أخرى.",
			},
			phish: {
				title: "رابط تصيّد مصرفي",
				did: {
					login: "سجّلت الدخول في الصفحة التي أرسلها البريد.",
					official: "تجاهلت الرابط وفتحت موقع البنك بنفسك.",
					delete: "حذفت الرسالة دون النقر على الرابط.",
				},
				outcome: {
					login:
						"كانت الصفحة نسخة على نطاق آخر. وصل رقمك وكلمة مرورك إلى المحتالين فأفرغوا حسابك: تم تحويل 85,000 دج.",
					official:
						"أحسنت. على الموقع الحقيقي كان حسابك سليمًا: الرسالة كانت مزيفة.",
					delete: "أحسنت. لم تحصل الصفحة المزيفة على كلمة مرورك.",
				},
				flags: [
					'الاستعجال: "تم التعليق"، "خلال 24 ساعة"، "سيُغلق نهائيًا".',
					"المرسل والصفحة على \u2066arcbank-verify-account.com\u2069، وليس على نطاق البنك (\u2066arcbank.dz\u2069).",
					"تمرير المؤشر فوق الرابط يكشف وجهته الحقيقية.",
					'تحية عامة "عزيزي العميل" بدل اسمك.',
					'المتصفح يصف الصفحة بأنها "غير آمنة".',
				],
				habit:
					"لا تسجّل الدخول أبدًا عبر رابط في رسالة. اكتب عنوان البنك بنفسك أو استخدم تطبيقه.",
			},
			update: {
				title: "تحديث متصفح مزيف",
				did: {
					install: "نزّلت Update.exe وشغّلته.",
					close: "أغلقت علامة التبويب التي تعرض شريط التحديث.",
					settings: "بحثت عن التحديثات في إعدادات المتصفح نفسه.",
				},
				outcome: {
					install:
						"كان برنامجًا إعلانيًا: نوافذ منبثقة في كل مكان، وصفحة رئيسية مختطفة، وتتبع لتصفحك.",
					close:
						"أحسنت. وللتأكد، يمكنك أيضًا فتح قائمة المتصفح نفسه (الإعدادات > حول).",
					settings: "أحسنت. المتصفح يحدّث نفسه، وكان محدّثًا بالفعل.",
				},
				flags: [
					"التحديثات الحقيقية لا تأتي أبدًا من موقع ويب: المتصفحات تحدّث نفسها.",
					"الملف يأتي من نطاق آخر (\u2066browser-update-center.click\u2069)، لا من موقع الأخبار ولا من صانع المتصفح.",
					"شريط يغطي الصفحة كلها ويحجب المقال ويدفعك للتصرف فورًا.",
					"صفحة ويب تعرض عليك ملف \u2066.exe\u2069.",
				],
				habit:
					"تجاهل نوافذ التحديث على المواقع. حدّث من قائمة المتصفح نفسه (الإعدادات > حول).",
			},
			invoice: {
				title: 'فاتورة تطلب "تمكين المحتوى"',
				did: {
					enable: "فتحت الفاتورة ونقرت على تمكين المحتوى.",
					forward: "أعدت توجيه الرسالة إلى صديق ليتحقق منها.",
					delete: "حذفت الرسالة دون تمكين أي شيء.",
				},
				outcome: {
					enable:
						"كان الماكرو برنامج فدية. تم تشفير ملفاتك وإعادة تسميتها بامتداد \u2066.locked\u2069، ويطلب المجرمون المال لفك تشفيرها، دون أي ضمان.",
					forward:
						"بقيت في أمان، لكنك نقلت الخطر: فتحها صديقك وأُصيب جهازه. احذف الرسائل المشبوهة أو أبلغ عنها بدل إعادة توجيهها.",
					delete: "أحسنت. لم يعمل الماكرو أبدًا.",
				},
				flags: [
					"فاتورة لم تكن تنتظرها، لطرد لا تتذكره.",
					"ملف يحتوي على وحدات ماكرو (\u2066.docm\u2069): يمكنه تشغيل برامج.",
					'مستند يخفي محتواه حتى تنقر على "تمكين المحتوى".',
					'الضغط: "الدفع متأخر"، "رسوم إضافية".',
				],
				habit:
					"لا تمكّن وحدات الماكرو أبدًا في مستند وصلك. إن فاجأتك فاتورة، تحقق عبر الموقع الرسمي للشركة.",
			},
			scam: {
				title: "شاشة احتيال الدعم الفني",
				did: {
					call: "اتصلت بالرقم المعروض في الصفحة.",
					close: "أغلقت المتصفح عبر إدارة المهام.",
				},
				outcome: {
					call: 'حصل "الفني" على وصول عن بُعد إلى حاسوبك عبر RemoteFix، ثم طلب 25,000 دج ورقم بطاقتك مقابل إصلاح وهمي.',
					close:
						"أحسنت. كانت مجرد صفحة ويب: إغلاق المتصفح أنهاها، ولم يُثبَّت أي شيء.",
				},
				flags: [
					"الشركات الحقيقية لا تضع أبدًا رقم هاتف في نافذة تحذير.",
					'أساليب التخويف: صفارة إنذار، شاشات حمراء، "سيتم حذف ملفاتك".',
					"صفحة تمنع الإغلاق وتتجاهل زر Esc.",
					"صفحة ويب لا يمكنها فحص حاسوبك.",
				],
				habit:
					"لا تتصل. أغلق المتصفح: إدارة المهام (\u2066Ctrl+Shift+Esc\u2069) > إنهاء المهمة، أو \u2066Alt+F4\u2069 على حاسوب حقيقي.",
			},
			vishing: {
				title: 'رمز SMS ومكالمة من "البنك"',
				did: {
					read: "قرأت رمز الرسالة للمتصل.",
					askName: "سألته عن اسمه وقلت إنك ستعاود الاتصال.",
					hangup: "أغلقت الخط واتصلت بالرقم المكتوب على ظهر بطاقتك.",
				},
				outcome: {
					read: "الرمز أكّد عملية دفع، لا إلغاءها. أفرغ المحتالون حسابك: ضاع 240,000 دج.",
					askName:
						"لم تعطه الرمز، وهذا هو الأهم. لكن الاسم لا يثبت شيئًا، وقد ضغط عليك لتبقى على الخط. أغلق الخط فورًا.",
					hangup:
						"أحسنت. ArcBank الحقيقي لا يطلب الرموز عبر الهاتف أبدًا، وكان حسابك في أمان.",
				},
				flags: [
					'الرسالة نفسها تقول "لا تشارك هذا الرمز أبدًا".',
					"يمكن تزوير رقم المتصل: ظهر رقم ArcBank الحقيقي.",
					"الاستعجال: عملية دفع موقوفة، ولا وقت للتفكير.",
					"البنك لا يطلب منك أبدًا قراءة رمز بصوت عالٍ.",
				],
				habit:
					"لا تشارك أي رمز عبر الهاتف. أغلق الخط واتصل بالرقم المكتوب على ظهر بطاقتك.",
			},
		},

		phoneApps: {
			messages: "الرسائل",
			phone: "الهاتف",
			auth: "المصادقة",
			settings: "الإعدادات",
			camera: "الكاميرا",
			photos: "المعرض",
			calendar: "التقويم",
			browser: "الإنترنت",
		},
		noMessages: "لا توجد رسائل",
		noMessagesSub: "ستظهر الرسائل التي تصلك هنا.",
		noAccounts: "لا توجد حسابات بعد",
		noAccountsSub: "ستظهر رموز حساباتك هنا.",
		settingsRows: ["Wi-Fi", "بلوتوث", "الإشعارات", "الأمان", "حول الهاتف"],
		call: "اتصال",
	},
};

export type Strings = (typeof strings)["en"];

export const getStrings = (lang: Lang): Strings => strings[lang] as Strings;

export function useT(): Strings {
	return getStrings(useGame((s) => s.lang));
}
