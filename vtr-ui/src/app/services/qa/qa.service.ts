import { Injectable } from '@angular/core';
import { QA } from '../../data-models/qa/qa.model';

@Injectable({
	providedIn: 'root'
})
export class QaService {

	imagePath = 'assets/images/qa';
	qas: QA[] = [
		{
			id: 1,
			path: 'support-detail/1',
			iconPath: `${this.imagePath}/svg_icon_qa_backup.svg`,
			title: 'Backup and Restore your files',
			like: false,
			dislike: false,
			description: `<div>
									<div style="font-size:4rem;font-weight:bold;">
										Back up and restore your files
									</div>
									<hr/>
									<div style="margin-bottom:7rem;">
										It's always good to have a backup. Keep copies of your files on another drive in case something happens to the originals.
									</div>
									<div style="font-size:3rem;font-weight:bold;">
										Set up your backup
									</div>
									<hr/>
									<div class="mb-5">
										Select the <span style="font-weight:bold">Start</span>  button, select <span style="font-weight:bold">Settings</span>    > <span style="font-weight:bold">Update & security</span>    > <span style="font-weight:bold">Backup</span>    > <span style="font-weight:bold">Add a drive</span>  , and then choose an external drive or network location for your backups.
									</div>
									<div class="mb-5">
										<img src="./../../../../assets/images/qa/1.1.png"/>
									</div>
									<div class="mb-5">
										All set. Every hour, we'll back up everything in your user folder (C:\\Users\\username). To change which files get backed up or how often backups happen, go to <span style="font-weight:bold;">More options</span>.
									</div>
									<div  style="font-size:3rem;font-weight:bold;">
										Restore your files
									</div>
									<div class="mb-5">
										If you're missing an important file or folder, here's how to get it back:
									</div>
									<div>

											 <div class="mb-3">1. Type <span style="font-weight:bold;">Restore files</span> in the search box on the taskbar, and then select <span clas="font-weight:bold"> Restore your files with File History</span>.</div>
										     <div class="mb-3">2. Look for the file you need, then use the arrows to see all its versions</div>
											 <div class="mb-3">3. When you find the version you want, select <span style="font-weight:bold">Restore</span> to save it in its original location. To save it in a different place, press and hold (or right-click) <span style="font-weight:bold">Restore</span>, select <span style="font-weight:bold">Restore to</span>, and then choose a new location.</div>

									</div>

								</div>`
		},
		{
			id: 2,
			path: 'support-detail/2',
			iconPath: `${this.imagePath}/svg_icon_qa_refresh.svg`,
			title: 'How to refresh your PC',
			like: false,
			dislike: false,
			description: `<div>
										<div style="font-size:4rem;font-weight:bold;">
											How to refresh your PC
										</div>
										<hr>
										<div style="font-size:2.5rem;font-weight:bold;padding:5px 0;">
											Symptom
										</div>
										<div style="padding:5px 0;">
											If your PC isn't performing as well as it once did, and you don't know why,
											you can refresh your PC without deleting any of your personal files or
											changing your settings. Windows can “refresh” your PC so it’s more like a
											fresh install without deleting your personal files.
										</div>
										<div style="padding:5px 0;">
											Refresh your PC, Here is what will happen: your files and personalized
											settings won’t change
										</div>
										<div style="padding:5px 0;">
											<ul>
												<li>Your PC settings will be changed back to its defaults</li>
												<li>Apps from windows store will be kept</li>
												<li>Apps you installed from disc or website will be removed</li>
												<li>A list of removed files will be saved on your desktop</li>
											</ul>
										</div>


										<div style="font-size:2.5rem;font-weight:bold;padding:10px 0;">
											Affected Brands
										</div>

										<div>
											<ul>
												<li>All Desktop and Laptops</li>

											</ul>
										</div>

										<div style="font-size:2.5rem;font-weight:bold;padding:10px 0;">
											Operation System
										</div>

										<div>
											<ul>
												<li>Windows 8, 8.1 & 10</li>

											</ul>
										</div>

										<div style="font-size:2.5rem;font-weight:bold;padding:10px 0;">
											Solution
										</div>

										<div>
											<ul class="list-unstyled">
												<li>
													<span style="text-decoration: underline;padding:10px 0;font-weight: bold">Windows 8/8.1</span>
													<ol>
														<li style="padding:5px 0;">
															Tap or click <span style="font-weight:bold;"> Settings </span>
														</li>

														<li style="padding:5px 0;">
															Tap or click <span style="font-weight:bold;"> Update and recovery</span>
														</li>

														<li style="padding:5px 0;">
															<div>Tap or click <span style="font-weight:bold;">  Recovery</span></div>
															<div style="padding:5px 0">Under Refresh your PC without affecting your files, tap or click <span style="font-weight:bold;"> Get started.</span></div>
															<div><img src="./../../../../assets/images/qa/2.1.png"/></div>

														</li>

														<li style="padding:5px 0;">
															Click <span style="font-weight:bold;">  "Next"</span>.
														</li>

														<li style="padding:5px 0;">
															Click <span style="font-weight:bold;"> "Refresh" </span>to start the refresh process.
														</li>
														<li style="padding:5px 0;">
															Once the refresh process is done, you can find a Removed Apps list on the desktop
														</li>

														<li style="padding:5px 0;">
															You can find the removed apps while refreshing your system
														</li>
													</ol>
												</li>
												<li style="padding:10px 0;">
													<span style="text-decoration: underline;font-weight: bold">Windows 10</span>
													<ol>
														<li style="padding:5px 0;"> Search for <span style="font-weight:bold;"> refresh </span>in the search tool available in the Start menu,</li>
														<li style="padding:5px 0;"><div>Click on <span style="font-weight:bold;"> "Refresh your PC without affecting your files"</span> in the search results as shown below.</div>
														 <div><img src="./../../../../assets/images/qa/2.2.jpg"/></div>
														</li>
														<li style="padding:5px 0;">
															<div>Click on the <span style="font-weight:bold;"> Get started </span>button just below the heading<span style="font-weight:bold;">  "Refresh your PC without affecting your files"</span> to start refreshing your Windows 10 PC.</div>
														 <div><img src="./../../../../assets/images/qa/2.3.jpg"/></div>
														</li>
													</ol>
												</li>
											</ul>
										</div>

										<div style="font-size:2.5rem;font-weight:bold;">
											Additional Information
										</div>

										<div>
											In most cases, once you start to refresh your PC, it’ll finish on its own.
											However, if Windows needs missing files, you’ll be asked to insert recovery
											media, which is typically a DVD disc or thumb drive. If that happens, what
											you’ll need depends on your PC.
										</div>
										<div style="padding:10px 0">
											If you upgraded your PC to Windows 8.1 or Windows RT 8.1 with a DVD, use
											that disc. If you don’t have Windows 8.1 or Windows RT 8.1 media, contact
											Microsoft Support.
										</div>

									</div>`
		},
		{
			id: 3,
			path: 'support-detail/3',
			iconPath: `${this.imagePath}/svg_icon_qa_pcbit.svg`,
			title: 'How to know your machine\'s CPU',
			like: false,
			dislike: false,
			description: `<div style="font-size:4rem;font-weight:bold;">
				How to know your machine\'s CPU
			</div>
			<hr>
			<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Symptom</h3>
<p>The terms 32-bit and 64-bit refer to the way a computer's processor (also called a CPU), handles information. The 64-bit version of Windows handles large amounts of random access memory (RAM) more effectively than a 32-bit system.</p>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Affected Brands</h3>
<p>The above symptom is associated with, but not limited to, the following systems:</p>
<ul>
<li>All Desktop and Laptops</li>
</ul>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Operating System</h3>
<ul>
<li>Windows 7 , 8 , 10</li>
</ul>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Solution</h3>
<p><strong><u>Windows 7 or Vista</u></strong></p>
<ol>
<li>Open System by clicking the <strong>Start button </strong>Picture of the <strong>Start button,</strong> right-clicking Computer, and then clicking Properties&nbsp;&nbsp;</li>
<li>Under System, you can view the system type.</li>
</ol>
<p><strong><u>Windows 8 and Windows 10</u></strong></p>
<p><strong>Method 1:</strong> View the System window in Control Panel</p>
<ol>
<li>Swipe in from the right edge of the screen, and then tap <strong>Search</strong>. Or, if you are using a mouse, point to the lower-right corner of the screen, and then click <strong>Search.</strong></li>
<li>Type <strong>system</strong> in the search box, and then tap or click <strong>Settings.</strong></li>
<li>Tap or click <strong>System</strong></li>
<li>If you are running a 64-bit version of Windows 8, <strong>64-bit Operating System</strong> is displayed in the System type field under the System heading. If you are running a 32<strong>-bit version of Windows</strong> <strong>8,</strong> <strong>32-bit Operating </strong>System is displayed in the System type field under the System heading.<br /> &nbsp;</li>
</ol>
<p><strong>Method 2</strong>: View the System Information window</p>
<ol>
<li>Swipe in from the right edge of the screen, and then tap&nbsp;<strong>Search</strong>. Or, if you are using a mouse, point to the lower-right corner of the screen, and then click&nbsp;<strong>Search.</strong></li>
<li>In the search box, type&nbsp;<strong>system information</strong></li>
<li>Tap or click<strong>&nbsp;System</strong>, tap or click&nbsp;<strong>System Information,</strong> and then click&nbsp;<strong>System Summary.</strong></li>
<li>If you are running a <strong>64-bit </strong>version of Windows 8<strong>,&nbsp;</strong>x64-based PC&nbsp;is displayed in the&nbsp;<strong>System type</strong>&nbsp;field under the&nbsp;Item&nbsp;heading.&nbsp;<br /> <br /> If you are running a<strong> 32-bit</strong> version of Windows 8,&nbsp;x86-based PC&nbsp;is displayed in the&nbsp;<strong>System type</strong>&nbsp;field under the&nbsp;Item&nbsp;heading. &nbsp;</li>
</ol>
<p>&nbsp;</p>`
		},
		{
			id: 4,
			path: 'support-detail/4',
			iconPath: `${this.imagePath}/svg_icon_qa_battery.svg`,
			title: "Check your machine's battery use",
			like: false,
			dislike: false,
			description: `<div style="font-size:4rem;font-weight:bold;">
				Check your machine's battery use
			</div>
			<hr>
			<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Symptom</h3>
<p>Windows 10 includes a new &ldquo;<strong>Battery Use&rdquo;</strong>&nbsp;screen that shows you what&rsquo;s draining your laptop&rsquo;s juice. That means it&rsquo;ll tell you exactly what apps&ndash;both desktop and Windows 10 &ldquo;universal&rdquo; apps&ndash;are using too much power.</p>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Affected Brands</h3>

<ul>
<li>Lenovo laptops, desktops</li>
</ul>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Affected Systems</h3>
<ul>
<li>All</li>
</ul>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Operationg System</h3>
<ul>
<li>Window 10</li>
</ul>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Solution</h3>
<p>This feature is new in Windows 10, we need to find this feature first as it is not stored in your traditional&nbsp;<strong>control panel&nbsp;</strong>view, this feature is located in the new&nbsp;<strong>&ldquo;Settings&rdquo;</strong>&nbsp;app</p>
<p><br /> </p>
<p> <h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">A. Find the Battery Use Screen</h3></p>
<p>1. Click or Tap the&nbsp;<strong>&ldquo;Settings</strong>&rdquo; option from the start menu</p>
<p>2. In&nbsp;<strong>Settings&nbsp;</strong>select&nbsp;<strong>&ldquo;System&rdquo;</strong>and then select&nbsp;<strong>&ldquo;Battery saver.&rdquo;<br /> <br /> </strong> <strong><br /> <br /> </strong></p>
<p><img src="./../../../assets/images/qa/4.1.jpg"/></p>
<p>3. Click or tap the&nbsp;<strong>&ldquo;Battery use&rdquo;</strong> link under this heading to see more details. </p>
<p>&nbsp;</p>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">B. Analyze Your Power Usage</h3>
<p>4 You can change to make the battery use screen to display battery use from last 24 hours to last 48 hours or last from last week</p>
<p>5 <strong>&ldquo;System,&rdquo;</strong>&nbsp;&ldquo;<strong>Display,</strong>&rdquo; and &ldquo;<strong>Wi-Fi&rdquo;</strong>&nbsp;percentages. This shows how much battery power has been used by system processes, the display,</p>
<p>6 The&nbsp;<strong>&ldquo;In use&rdquo;</strong>&nbsp;and&nbsp;<strong>&ldquo;Background&rdquo;</strong>&nbsp;options show how much power is used by applications while you&rsquo;re using them, compared to applications running in the background.</p>
<p>7 If apps are using power in the background, you can click or tap the&nbsp;<strong>&ldquo;Change background app settings&rdquo;&nbsp;</strong>link and configure apps to not run in the background. This only works for universal Windows 10 apps.</p>
<p>8 Scroll down further and you will see a list of applications, this is considered as the most useful section of this feature. It will display a list of the apps have used battery power in that period, and show you what percentage of your battery power each app has used</p>
<p><img src="./../../../assets/images/qa/4.2.jpg"/></p>
<p>&nbsp;</p>`
		},
		{
			id: 5,
			path: 'support-detail/5',
			iconPath: `${this.imagePath}/svg_icon_qa_tablet.svg`,
			title: 'Use your PC like a tablet',
			like: false,
			dislike: false,
			description: `<div style="font-size:4rem;font-weight:bold;">
				 Use your PC like a tablet
			 </div>
			 <hr>
<p>Tablet mode makes Windows more intuitive and easier to use when you have a touchscreen device.</p>

<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Use tablet mode</h3>
<p>To turn on tablet mode, select <strong>action center</strong> on the taskbar,&nbsp;then select <strong>Tablet mode</strong> .</p>
<p>&nbsp;</p>
<p><img src="./../../../assets/images/qa/5.1.jpg"/></p>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Note</h3>
<p>To find out if your device&nbsp;can automatically turn on tablet mode, search for your device&nbsp;on the manufacturer's website. Support for this feature depends on the hardware, the driver that's installed, and how the device was set up by the manufacturer.&nbsp;</p>
<p>&nbsp;</p>
<p>In tablet mode, apps open full screen, giving you more space to work. To close an app, drag it to the bottom of the screen.</p>
<p>&nbsp;</p>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Tip</h3>
<p>The taskbar is available when your PC is in tablet mode, but you can hide it if you want more room on the screen. Select the <strong>Start </strong>button, select <strong>Settings </strong>&gt; <strong>System </strong>&gt; <strong>Tablet mode </strong>,&nbsp;then turn on <strong>Automatically hide the taskbar in tablet mode</strong>. To see the hidden taskbar, swipe up from the bottom of the screen, or use your&nbsp;mouse to hover there.</p>

<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Use two apps simultaneously</h3>
<p>To use two apps side by side in tablet mode, drag an open app down and to the side. You'll see where it'll snap, and you'll see any open apps&nbsp;next to it.</p>
<p>In this view, you can also:</p>
<ul>
<li>Use the shared edge between two snapped apps to resize both apps at the same time.</li>
<li>Open a&nbsp;new app from task view&mdash;select <strong>Task view</strong> on the taskbar, select an app, then drag it to one side to snap it into your divided screen.</li>
<li>Use the back button on the taskbar to go back in an app, or to open an&nbsp;app that you were using before.</li>
</ul>
<p>&nbsp;</p>`
		},
		{
			id: 6,
			path: 'support-detail/6',
			iconPath: `${this.imagePath}/svg_icon_qa_cortana.svg`,
			title: 'Get to know Cortana, your personal assistant',
			like: false,
			dislike: false,
			description: `<div style="font-size:4rem;font-weight:bold;">
				Get to know Cortana, your personal assistant
			</div>
			<hr>
			<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">What is Cortana?</h3>
<hr/>
<p>Cortana is your digital agent. She'll help you get things done.</p>
<p>The more you use Cortana, the more personalized your experience will be.</p>
<p>To get started, type a question in the search box, or select the microphone&nbsp;&nbsp;and talk to Cortana. (Typing works for all types of PCs, but you need a mic to talk.)</p>
<p>If you&rsquo;re not sure what to say, you&rsquo;ll see suggestions on your lock screen, and in Cortana home when you select the search box on the taskbar.</p>
<p><img src="./../../../assets/images/qa/6.1.png"/></p>
<ol>
<li>Home 2. Notebook 3. Settings 4. Feedback</li>
</ol>
<p>Here are some things Cortana can do for you:</p>
<ul>
<li>Give you reminders based on time, places, or people.</li>
<li>Track packages, teams, interests, and flights.</li>
<li>Send emails and texts.</li>
<li>Manage your calendar and keep you up to date.</li>
<li>Create and manage lists.</li>
<li>Chit chat and play games.</li>
<li>Find facts, files, places, and info.</li>
<li>Open any app on your system.</li>
</ul>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Try this: Set a reminder</h3><hr/>

<p>One of the things Cortana can do is to give you reminders. She can remind you to do things based on time, places, or even people.</p>
<p>For example, type or say, "Remind me to congratulate Tanya the next time she calls."</p>
<p>The reminder will appear when you get a call from Tanya.</p>
<p>Extra bonus&mdash;if you have a Windows phone or Cortana for iPhone or Android, you can set Cortana to sync notifications between your PC and phone.</p>
<p><img src="./../../../assets/images/qa/6.2.png"/></p>
<h3 style="font-weight:bold;font-size:2.5rem;padding:10px 0">Hey Cortana?</h3><hr/>
<p>Set Cortana to hear you anytime you say "Hey Cortana." Select the search box on the taskbar to open Cortana home. Then select&nbsp;<strong>Settings</strong>&nbsp;&nbsp;and turn on&nbsp;<strong>Let Cortana respond to "Hey Cortana."</strong></p>
<p><img src="./../../../assets/images/qa/6.3.png"/></p>
<p>Note</p>
<p>Cortana is only available in certain countries/regions, and some Cortana features might not be available everywhere.</p>
<p>&nbsp;</p>`
		}
	];

	constructor() {
	}

	getById(id: number): QA {
		return this.qas.find((element, index, array) => {
			return element.id === id;
		});
	}
}
