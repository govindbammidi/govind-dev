import * as React from "react";

/**
 * Post diagrams - hand-authored inline SVG, no runtime, no images.
 *
 * House rules, so a later one matches these two:
 *  - box strokes and arrows in var(--color-muted); label text inherits
 *    currentColor (the figure sets it to --color-tag, same as <pre>)
 *  - rust (--color-accent) is spent on exactly ONE thing per figure: the
 *    element the argument turns on
 *  - dashed = "may never arrive"; solid = guaranteed
 *  - every svg carries role="img" + aria-label saying what it shows
 *  - viewBox is sized for the content and CSS scales it. side-by-side
 *    panels are separate <svg>s so they stack, not shrink, on a phone.
 */

const MUTED = "var(--color-muted)";
const ACCENT = "var(--color-accent)";
const PAPER = "var(--color-paper)";

function Arrowhead({ id, color = MUTED }: { id: string; color?: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 8 8"
        refX="8"
        refY="4"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L8 4 L0 8 Z" fill={color} />
      </marker>
    </defs>
  );
}

/** panel chrome shared by the two halves of the webhook figure */
function PanelHead({ title }: { title: string }) {
  return (
    <>
      <text x="4" y="13" fontSize="11.5" letterSpacing="0.3">
        {title}
      </text>
      <line x1="4" y1="21" x2="276" y2="21" stroke="var(--color-line)" />
    </>
  );
}

function Box({
  x,
  y,
  w,
  h,
  label,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={PAPER}
        stroke={accent ? ACCENT : MUTED}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        fontSize="12"
        textAnchor="middle"
        fill={accent ? ACCENT : "currentColor"}
      >
        {label}
      </text>
    </>
  );
}

type DiagramLine = {
  t: string;
  size?: number;
  muted?: boolean;
  accent?: boolean;
};

/** a box whose label is one to three stacked lines, vertically centred */
function LBox({
  x,
  y,
  w,
  h,
  lines,
  accent,
  gap = 17,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: DiagramLine[];
  accent?: boolean;
  gap?: number;
}) {
  const cx = x + w / 2;
  const first = y + h / 2 + 4 - ((lines.length - 1) * gap) / 2;
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={PAPER}
        stroke={accent ? ACCENT : MUTED}
      />
      {lines.map((l, i) => (
        <text
          key={l.t}
          x={cx}
          y={first + i * gap}
          fontSize={l.size ?? 11.5}
          textAnchor="middle"
          fill={l.accent ? ACCENT : l.muted ? MUTED : "currentColor"}
        >
          {l.t}
        </text>
      ))}
    </>
  );
}

/**
 * Figure 1 - the browser moves off the path.
 * Same three objects in both panels; the only difference is whether the
 * browser is a link in the chain or a bystander beside it.
 */
export function WebhookPathDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-row">
        <div className="diagram-panel">
          <svg
            viewBox="0 0 280 226"
            role="img"
            aria-label="What I pictured: razorpay posts the webhook to the frontend, which forwards it to my backend. The browser is a link in the chain, so one closed tab breaks it."
          >
            <Arrowhead id="dgm-webhook-a" />
            <PanelHead title="what i pictured" />

            <Box x={10} y={42} w={140} h={38} label="razorpay" />
            <line
              x1="80"
              y1="80"
              x2="80"
              y2="106"
              stroke={MUTED}
              markerEnd="url(#dgm-webhook-a)"
            />
            <text x="90" y="97" fontSize="10.5" fill={MUTED}>
              webhook, i thought
            </text>

            <Box x={10} y={110} w={140} h={38} label="the browser" accent />
            <text x="166" y="124" fontSize="11" fill={MUTED}>
              one closed tab
            </text>
            <text x="166" y="138" fontSize="11" fill={MUTED}>
              breaks the chain
            </text>

            <line
              x1="80"
              y1="148"
              x2="80"
              y2="174"
              stroke={MUTED}
              markerEnd="url(#dgm-webhook-a)"
            />
            <text x="90" y="165" fontSize="10.5" fill={MUTED}>
              then to my server
            </text>

            <Box x={10} y={178} w={140} h={38} label="my backend" />
          </svg>
        </div>

        <div className="diagram-panel">
          <svg
            viewBox="0 0 280 226"
            role="img"
            aria-label="What actually happens: razorpay's servers POST straight to my backend, server to server. The browser sits off the path entirely."
          >
            <Arrowhead id="dgm-webhook-b" />
            <PanelHead title="what actually happens" />

            <Box x={10} y={42} w={140} h={38} label="razorpay servers" />

            {/* one hop, interrupted only where its label sits */}
            <line x1="80" y1="80" x2="80" y2="104" stroke={MUTED} />
            <text x="80" y="118" fontSize="11" textAnchor="middle">
              POST
            </text>
            <text x="80" y="132" fontSize="11" textAnchor="middle" fill={MUTED}>
              server → server
            </text>
            <line
              x1="80"
              y1="142"
              x2="80"
              y2="174"
              stroke={MUTED}
              markerEnd="url(#dgm-webhook-b)"
            />

            <Box x={10} y={178} w={140} h={38} label="my backend" />

            {/* the same box as the left panel, now with nothing attached */}
            <Box x={164} y={110} w={110} h={38} label="the browser" accent />
            <text
              x="219"
              y="164"
              fontSize="10.5"
              textAnchor="middle"
              fill={MUTED}
            >
              not on the path
            </text>
          </svg>
        </div>
      </div>
      <figcaption>
        the webhook never touches the browser - which is the entire reason it
        survives the tab closing.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 2 - two independent arrivals, one idempotent door.
 * Dashed marks the leg that may never arrive; rust marks the join, which is
 * what the section is actually about.
 */
export function TwoPathsDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-solo">
        <svg
          viewBox="0 0 320 308"
          role="img"
          aria-label="Two paths into one door: the user's browser calls verify-payment, drawn dashed because it only arrives if the tab is still open, while razorpay's servers post payment.captured, drawn solid because it always arrives. Both converge on one idempotent activation where whichever lands first does the work."
        >
          <Arrowhead id="dgm-paths" />

          <Box x={8} y={26} w={130} h={38} label="user's browser" />
          <Box x={182} y={26} w={130} h={38} label="razorpay servers" />

          <line
            x1="73"
            y1="64"
            x2="73"
            y2="92"
            stroke={MUTED}
            strokeDasharray="4 4"
            markerEnd="url(#dgm-paths)"
          />
          <text x="79" y="82" fontSize="10.5" fill={MUTED}>
            on success
          </text>

          <line
            x1="247"
            y1="64"
            x2="247"
            y2="92"
            stroke={MUTED}
            markerEnd="url(#dgm-paths)"
          />
          <text x="253" y="82" fontSize="10.5" fill={MUTED}>
            on capture
          </text>

          <rect
            x="8"
            y="96"
            width="130"
            height="70"
            fill={PAPER}
            stroke={MUTED}
          />
          <text x="73" y="116" fontSize="10.5" textAnchor="middle" fill={MUTED}>
            PATH 1
          </text>
          <text x="73" y="136" fontSize="11.5" textAnchor="middle">
            verify-payment
          </text>
          <text x="73" y="155" fontSize="10.5" textAnchor="middle" fill={MUTED}>
            needs the tab open
          </text>

          <rect
            x="182"
            y="96"
            width="130"
            height="70"
            fill={PAPER}
            stroke={MUTED}
          />
          <text
            x="247"
            y="116"
            fontSize="10.5"
            textAnchor="middle"
            fill={MUTED}
          >
            PATH 2
          </text>
          <text x="247" y="136" fontSize="11.5" textAnchor="middle">
            payment.captured
          </text>
          <text
            x="247"
            y="155"
            fontSize="10.5"
            textAnchor="middle"
            fill={MUTED}
          >
            server → server
          </text>

          {/* both legs land on the same node; only one of them is guaranteed */}
          <polyline
            points="73,166 73,196 160,196"
            fill="none"
            stroke={MUTED}
            strokeDasharray="4 4"
          />
          <polyline
            points="247,166 247,196 160,196"
            fill="none"
            stroke={MUTED}
          />
          <line
            x1="160"
            y1="196"
            x2="160"
            y2="230"
            stroke={MUTED}
            markerEnd="url(#dgm-paths)"
          />

          <rect
            x="22"
            y="234"
            width="276"
            height="66"
            fill={PAPER}
            stroke={ACCENT}
          />
          <text
            x="160"
            y="256"
            fontSize="12.5"
            textAnchor="middle"
            fill={ACCENT}
          >
            activate the subscription
          </text>
          <text
            x="160"
            y="274"
            fontSize="10.5"
            textAnchor="middle"
            fill={MUTED}
          >
            idempotent - whichever lands first
          </text>
          <text
            x="160"
            y="288"
            fontSize="10.5"
            textAnchor="middle"
            fill={MUTED}
          >
            does the work; the other finds it done
          </text>
        </svg>
      </div>
      <figcaption>
        path 1 is for the user, path 2 is for the truth. both open the same
        door, so it has to be safe to open twice.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 3 - the receipt is frozen at payment time, not rebuilt on download.
 * Accent follows the stored bytes, because those are what comes back.
 */
export function ReceiptFreezeDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-solo diagram-wide">
        <svg
          viewBox="0 0 340 274"
          role="img"
          aria-label="When a parent pays, two things are written at once: receipt_data holds the frozen facts as JSON and receipt_pdf holds the rendered bytes. Later, a download hands back those exact bytes rather than rebuilding the receipt from live data."
        >
          <Arrowhead id="dgm-receipt" />
          <Arrowhead id="dgm-receipt-hot" color={ACCENT} />

          <LBox x={100} y={14} w={140} h={36} lines={[{ t: "parent pays" }]} />

          {/* one payment, two writes */}
          <line x1="170" y1="50" x2="170" y2="68" stroke={MUTED} />
          <line x1="88" y1="68" x2="252" y2="68" stroke={MUTED} />
          <line
            x1="88"
            y1="68"
            x2="88"
            y2="92"
            stroke={MUTED}
            markerEnd="url(#dgm-receipt)"
          />
          <line
            x1="252"
            y1="68"
            x2="252"
            y2="92"
            stroke={MUTED}
            markerEnd="url(#dgm-receipt)"
          />
          <text x="94" y="86" fontSize="10" fill={MUTED}>
            snapshot
          </text>
          <text x="258" y="86" fontSize="10" fill={MUTED}>
            render once
          </text>

          <LBox
            x={14}
            y={92}
            w={148}
            h={46}
            lines={[
              { t: "receipt_data" },
              { t: "the frozen facts", size: 10, muted: true },
            ]}
          />
          <LBox
            x={178}
            y={92}
            w={148}
            h={46}
            accent
            lines={[
              { t: "receipt_pdf", accent: true },
              { t: "the exact bytes", size: 10, muted: true },
            ]}
          />

          {/* the read path touches only the stored bytes */}
          <polyline
            points="252,138 252,190 170,190"
            fill="none"
            stroke={ACCENT}
          />
          <line
            x1="170"
            y1="190"
            x2="170"
            y2="210"
            stroke={ACCENT}
            markerEnd="url(#dgm-receipt-hot)"
          />
          <text x="258" y="166" fontSize="10" fill={MUTED}>
            on download
          </text>

          <LBox
            x={40}
            y={210}
            w={260}
            h={48}
            lines={[
              { t: "hand back those exact bytes", size: 12 },
              { t: "nothing is rebuilt", size: 10, muted: true },
            ]}
          />
        </svg>
      </div>
      <figcaption>
        the download path never reaches the live tables - so a fee structure
        that changes next term cannot reach back into last term&rsquo;s receipt.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 4 - the layer chain, and the one import that jumped over a link.
 * Accent is spent on the illegal edge; everything else is the house rule.
 */
export function LayerChainDiagram() {
  const layers = [
    "route",
    "controller",
    "service",
    "repository",
    "adapter",
    "the database",
  ];
  return (
    <figure className="diagram">
      <div className="diagram-solo">
        <svg
          viewBox="0 0 320 316"
          role="img"
          aria-label="Requests pass down a chain: route, controller, service, repository, adapter, database, each layer knowing only the next. The bug was an import that ran from the service straight to the adapter, skipping the repository."
        >
          <Arrowhead id="dgm-layers" />
          <Arrowhead id="dgm-layers-hot" color={ACCENT} />

          {layers.map((label, i) => (
            <LBox
              key={label}
              x={40}
              y={12 + i * 50}
              w={130}
              h={32}
              lines={[{ t: label, size: 11.5 }]}
            />
          ))}
          {layers.slice(1).map((label, i) => (
            <line
              key={label}
              x1="105"
              y1={44 + i * 50}
              x2="105"
              y2={62 + i * 50}
              stroke={MUTED}
              markerEnd="url(#dgm-layers)"
            />
          ))}

          <text x="178" y="70" fontSize="10" fill={MUTED}>
            each layer knows
          </text>
          <text x="178" y="83" fontSize="10" fill={MUTED}>
            only the next one
          </text>

          {/* the edge that should not exist */}
          <polyline
            points="170,128 214,128 214,228"
            fill="none"
            stroke={ACCENT}
          />
          <line
            x1="214"
            y1="228"
            x2="174"
            y2="228"
            stroke={ACCENT}
            markerEnd="url(#dgm-layers-hot)"
          />
          <text x="222" y="164" fontSize="10" fill={ACCENT}>
            the import
          </text>
          <text x="222" y="177" fontSize="10" fill={ACCENT}>
            that skipped
          </text>
          <text x="222" y="190" fontSize="10" fill={ACCENT}>
            a layer
          </text>
        </svg>
      </div>
      <figcaption>
        the repository is the only thing that is supposed to hold queries - so
        an import that reaches past it puts queries where nobody looks for them.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 5 - verifying a signature is recomputing it, not undoing it.
 * Both sides are deliberately identical; that symmetry is the whole point.
 */
export function SignatureCompareDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-solo diagram-wide">
        <svg
          viewBox="0 0 340 248"
          role="img"
          aria-label="Razorpay and my backend each run HMAC-SHA256 over the same order and payment ids with the same shared secret, producing the same digest. Verification compares the two digests; nothing is ever decrypted."
        >
          <Arrowhead id="dgm-sig" />

          <LBox x={14} y={14} w={138} h={34} lines={[{ t: "razorpay" }]} />
          <LBox x={188} y={14} w={138} h={34} lines={[{ t: "my backend" }]} />

          <text x="170" y="66" fontSize="10" textAnchor="middle" fill={MUTED}>
            same input · same secret
          </text>

          <line
            x1="83"
            y1="48"
            x2="83"
            y2="78"
            stroke={MUTED}
            markerEnd="url(#dgm-sig)"
          />
          <line
            x1="257"
            y1="48"
            x2="257"
            y2="78"
            stroke={MUTED}
            markerEnd="url(#dgm-sig)"
          />

          <LBox
            x={14}
            y={78}
            w={138}
            h={50}
            lines={[
              { t: "HMAC_SHA256", size: 11 },
              { t: "order | payment", size: 10, muted: true },
            ]}
          />
          <LBox
            x={188}
            y={78}
            w={138}
            h={50}
            lines={[
              { t: "HMAC_SHA256", size: 11 },
              { t: "order | payment", size: 10, muted: true },
            ]}
          />

          <line
            x1="83"
            y1="128"
            x2="83"
            y2="146"
            stroke={MUTED}
            markerEnd="url(#dgm-sig)"
          />
          <line
            x1="257"
            y1="128"
            x2="257"
            y2="146"
            stroke={MUTED}
            markerEnd="url(#dgm-sig)"
          />
          <text x="83" y="162" fontSize="11" textAnchor="middle">
            a91f4c77bd…
          </text>
          <text x="257" y="162" fontSize="11" textAnchor="middle">
            a91f4c77bd…
          </text>

          <polyline points="83,172 83,190 170,190" fill="none" stroke={MUTED} />
          <polyline
            points="257,172 257,190 170,190"
            fill="none"
            stroke={MUTED}
          />
          <line
            x1="170"
            y1="190"
            x2="170"
            y2="204"
            stroke={MUTED}
            markerEnd="url(#dgm-sig)"
          />

          <LBox
            x={54}
            y={204}
            w={232}
            h={40}
            accent
            lines={[
              { t: "identical → genuine", size: 12, accent: true },
              { t: "nothing was decrypted", size: 10, muted: true },
            ]}
          />
        </svg>
      </div>
      <figcaption>
        there is no key that opens the signature. both sides do the same one-way
        arithmetic and compare the answers.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 6 - one price, three homes, and only one of them talks to razorpay.
 */
export function PriceInThreePlacesDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-solo diagram-wide">
        <svg
          viewBox="0 0 344 254"
          role="img"
          aria-label="The price is defined in three separate places. The ticket updated the landing page only; the registration constants and the backend PLAN_PRICING both kept the old number, and it is the backend one that creates the razorpay order the customer actually pays."
        >
          <Arrowhead id="dgm-price" />
          <Arrowhead id="dgm-price-hot" color={ACCENT} />

          <LBox
            x={10}
            y={14}
            w={150}
            h={44}
            lines={[
              { t: "landing page" },
              { t: "new price", size: 10, muted: true },
            ]}
          />
          <text x="172" y="40" fontSize="10" fill={MUTED}>
            the ticket updated this
          </text>

          <LBox
            x={10}
            y={72}
            w={150}
            h={44}
            lines={[
              { t: "registration" },
              { t: "old price", size: 10, muted: true },
            ]}
          />
          <text x="172" y="98" fontSize="10" fill={MUTED}>
            untouched
          </text>

          <LBox
            x={10}
            y={130}
            w={150}
            h={44}
            accent
            lines={[
              { t: "PLAN_PRICING", accent: true },
              { t: "old price", size: 10, muted: true },
            ]}
          />
          <line
            x1="160"
            y1="152"
            x2="198"
            y2="152"
            stroke={ACCENT}
            markerEnd="url(#dgm-price-hot)"
          />

          <LBox
            x={204}
            y={130}
            w={130}
            h={44}
            lines={[
              { t: "razorpay order", size: 11 },
              { t: "what is charged", size: 10, muted: true },
            ]}
          />
          <line
            x1="269"
            y1="174"
            x2="269"
            y2="196"
            stroke={ACCENT}
            markerEnd="url(#dgm-price-hot)"
          />

          <LBox
            x={60}
            y={196}
            w={274}
            h={44}
            lines={[
              { t: "the customer pays the old price", size: 11.5 },
              {
                t: "from the copy nobody thought to look at",
                size: 10,
                muted: true,
              },
            ]}
          />
        </svg>
      </div>
      <figcaption>
        three definitions, one of them wired to the payment gateway - the ticket
        changed the number the customer reads, not the one they pay.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 7 - the adapter is the seam. Everything above it is indifferent to
 * what sits below.
 */
export function AdapterSeamDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-solo diagram-wide">
        <svg
          viewBox="0 0 340 236"
          role="img"
          aria-label="The service calls the repository, which calls the adapter. Only the adapter knows the database, so firebase, postgres or anything else can be swapped underneath it without the layers above changing."
        >
          <Arrowhead id="dgm-seam" />

          <LBox x={92} y={12} w={120} h={32} lines={[{ t: "service" }]} />
          <line
            x1="152"
            y1="44"
            x2="152"
            y2="62"
            stroke={MUTED}
            markerEnd="url(#dgm-seam)"
          />
          <LBox x={92} y={62} w={120} h={32} lines={[{ t: "repository" }]} />
          <line
            x1="152"
            y1="94"
            x2="152"
            y2="112"
            stroke={MUTED}
            markerEnd="url(#dgm-seam)"
          />
          <LBox
            x={92}
            y={112}
            w={120}
            h={32}
            accent
            lines={[{ t: "adapter", accent: true }]}
          />
          <text x="222" y="124" fontSize="10" fill={MUTED}>
            the only file
          </text>
          <text x="222" y="137" fontSize="10" fill={MUTED}>
            that knows the
          </text>
          <text x="222" y="150" fontSize="10" fill={MUTED}>
            database
          </text>

          {/* one seam, three interchangeable things under it */}
          <line x1="152" y1="144" x2="152" y2="166" stroke={MUTED} />
          <line x1="52" y1="166" x2="252" y2="166" stroke={MUTED} />
          {[52, 152, 252].map((cx) => (
            <line
              key={cx}
              x1={cx}
              y1="166"
              x2={cx}
              y2="184"
              stroke={MUTED}
              markerEnd="url(#dgm-seam)"
            />
          ))}
          <LBox
            x={7}
            y={184}
            w={90}
            h={32}
            lines={[{ t: "firebase", size: 11 }]}
          />
          <LBox
            x={107}
            y={184}
            w={90}
            h={32}
            lines={[{ t: "postgres", size: 11 }]}
          />
          <LBox
            x={207}
            y={184}
            w={90}
            h={32}
            lines={[{ t: "anything", size: 11 }]}
          />
        </svg>
      </div>
      <figcaption>
        swap what sits under the adapter and nothing above it changes - the
        service never learns which database answered.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 8 - a schema per school, and the crossing that does not exist.
 */
export function TenantIsolationDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-solo diagram-wide">
        <svg
          viewBox="0 0 340 232"
          role="img"
          aria-label="One postgres database holds a shared public schema listing the tenants, plus one isolated schema per school. Each school's tables live in its own schema, and no path exists from one school's schema to another's."
        >
          <Arrowhead id="dgm-tenant" />

          <rect
            x="6"
            y="12"
            width="328"
            height="212"
            fill="none"
            stroke={MUTED}
            strokeDasharray="3 4"
          />
          <text x="16" y="28" fontSize="10" fill={MUTED}>
            one postgres database
          </text>

          <LBox
            x={100}
            y={40}
            w={140}
            h={46}
            lines={[
              { t: "public" },
              { t: "the tenant registry", size: 9.5, muted: true },
            ]}
          />

          <polyline points="170,86 170,104 87,104" fill="none" stroke={MUTED} />
          <polyline
            points="170,86 170,104 253,104"
            fill="none"
            stroke={MUTED}
          />
          <line
            x1="87"
            y1="104"
            x2="87"
            y2="126"
            stroke={MUTED}
            markerEnd="url(#dgm-tenant)"
          />
          <line
            x1="253"
            y1="104"
            x2="253"
            y2="126"
            stroke={MUTED}
            markerEnd="url(#dgm-tenant)"
          />

          <LBox
            x={22}
            y={126}
            w={130}
            h={48}
            lines={[
              { t: "tenant_schoolA", size: 11 },
              { t: "its own tables", size: 9.5, muted: true },
            ]}
          />
          <LBox
            x={188}
            y={126}
            w={130}
            h={48}
            lines={[
              { t: "tenant_schoolB", size: 11 },
              { t: "its own tables", size: 9.5, muted: true },
            ]}
          />

          {/* the path that is not there */}
          <line x1="156" y1="150" x2="184" y2="150" stroke={ACCENT} />
          <line
            x1="163"
            y1="143"
            x2="177"
            y2="157"
            stroke={ACCENT}
            strokeWidth="1.5"
          />
          <line
            x1="177"
            y1="143"
            x2="163"
            y2="157"
            stroke={ACCENT}
            strokeWidth="1.5"
          />
          <text x="170" y="198" fontSize="10" textAnchor="middle" fill={ACCENT}>
            no query can cross
          </text>
        </svg>
      </div>
      <figcaption>
        isolation is the schema boundary itself, not a `where school_id =`
        clause somebody has to remember to write.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 9 - two kinds of migration, two different destinations.
 */
export function MigrationSplitDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-solo diagram-wide">
        <svg
          viewBox="0 0 340 210"
          role="img"
          aria-label="base-schema holds the whole current structure and is run once to create a brand-new school. versions holds each numbered change and is replayed onto the schools that already exist."
        >
          <Arrowhead id="dgm-migrate" />
          <Arrowhead id="dgm-migrate-hot" color={ACCENT} />

          <LBox
            x={8}
            y={16}
            w={120}
            h={48}
            lines={[
              { t: "base-schema/", size: 11 },
              { t: "the whole structure", size: 9, muted: true },
            ]}
          />
          <line
            x1="128"
            y1="40"
            x2="208"
            y2="40"
            stroke={MUTED}
            markerEnd="url(#dgm-migrate)"
          />
          <text x="168" y="32" fontSize="9.5" textAnchor="middle" fill={MUTED}>
            run once
          </text>
          <LBox
            x={212}
            y={16}
            w={120}
            h={48}
            lines={[
              { t: "a new school", size: 11 },
              { t: "born with every table", size: 9, muted: true },
            ]}
          />

          <LBox
            x={8}
            y={110}
            w={120}
            h={48}
            accent
            lines={[
              { t: "versions/", size: 11, accent: true },
              { t: "each change, numbered", size: 9, muted: true },
            ]}
          />
          <line
            x1="128"
            y1="134"
            x2="208"
            y2="134"
            stroke={ACCENT}
            markerEnd="url(#dgm-migrate-hot)"
          />
          <text x="168" y="126" fontSize="9.5" textAnchor="middle" fill={MUTED}>
            replayed
          </text>
          <LBox
            x={212}
            y={110}
            w={120}
            h={48}
            lines={[
              { t: "existing schools", size: 11 },
              { t: "catch up, one by one", size: 9, muted: true },
            ]}
          />

          <text x="170" y="186" fontSize="10" textAnchor="middle" fill={MUTED}>
            every school has to end up at the same schema
          </text>
        </svg>
      </div>
      <figcaption>
        one folder births a tenant, the other keeps the tenants that already
        exist from drifting apart.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 10 - the same two boxes, before and after; what moves is where the
 * filtering happens.
 */
export function SearchMovedDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-row">
        <div className="diagram-panel">
          <svg
            viewBox="0 0 280 200"
            role="img"
            aria-label="Before: the server returns all one thousand faculty rows and the browser filters them in the tab."
          >
            <Arrowhead id="dgm-search-a" />
            <PanelHead title="before - the frontend fix" />

            <LBox
              x={10}
              y={40}
              w={180}
              h={50}
              lines={[
                { t: "server", size: 12 },
                { t: "returns everything", size: 10, muted: true },
              ]}
            />
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="128"
              stroke={MUTED}
              markerEnd="url(#dgm-search-a)"
            />
            <text x="108" y="112" fontSize="10.5" fill={MUTED}>
              all ~1000 rows
            </text>
            <LBox
              x={10}
              y={128}
              w={180}
              h={50}
              accent
              lines={[
                { t: "browser", size: 12, accent: true },
                { t: "filters, in the tab", size: 10, accent: true },
              ]}
            />
          </svg>
        </div>

        <div className="diagram-panel">
          <svg
            viewBox="0 0 280 200"
            role="img"
            aria-label="After: the server searches and paginates, and returns only the ten rows that were asked for; the browser just renders them."
          >
            <Arrowhead id="dgm-search-b" />
            <PanelHead title="after - the real fix" />

            <LBox
              x={10}
              y={40}
              w={180}
              h={50}
              accent
              lines={[
                { t: "server", size: 12, accent: true },
                { t: "searches + paginates", size: 10, accent: true },
              ]}
            />
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="128"
              stroke={MUTED}
              markerEnd="url(#dgm-search-b)"
            />
            <text x="108" y="112" fontSize="10.5" fill={MUTED}>
              10 rows
            </text>
            <LBox
              x={10}
              y={128}
              w={180}
              h={50}
              lines={[
                { t: "browser", size: 12 },
                { t: "just renders them", size: 10, muted: true },
              ]}
            />
          </svg>
        </div>
      </div>
      <figcaption>
        the two boxes never change - only which one does the filtering, and
        therefore how much has to cross the wire to get there.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 11 - one instant, two clock readings, and the gap between them.
 * Accent is the gap, because the gap is the bug.
 */
export function ClockSkewDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-solo diagram-wide">
        <svg
          viewBox="0 0 346 196"
          role="img"
          aria-label="At the same real instant, my laptop's clock reads 1:00:00.000 while supabase stamps approved_at as 1:00:00.760. The 0.759 second gap puts approved_at in the future, so the check approved_at is less than or equal to now returns false and the discount is dropped."
        >
          <Arrowhead id="dgm-clock" />

          <line
            x1="24"
            y1="70"
            x2="322"
            y2="70"
            stroke={MUTED}
            markerEnd="url(#dgm-clock)"
          />
          <line x1="96" y1="60" x2="96" y2="80" stroke={MUTED} />
          <line x1="262" y1="60" x2="262" y2="80" stroke={MUTED} />

          <text x="96" y="48" fontSize="10.5" textAnchor="middle">
            now (my laptop)
          </text>
          <text x="262" y="48" fontSize="10.5" textAnchor="middle">
            approved_at (supabase)
          </text>
          <text x="96" y="98" fontSize="11" textAnchor="middle" fill={MUTED}>
            1:00:00.000
          </text>
          <text x="262" y="98" fontSize="11" textAnchor="middle" fill={MUTED}>
            1:00:00.760
          </text>

          {/* the gap is the bug */}
          <line x1="96" y1="122" x2="262" y2="122" stroke={ACCENT} />
          <line x1="96" y1="117" x2="96" y2="127" stroke={ACCENT} />
          <line x1="262" y1="117" x2="262" y2="127" stroke={ACCENT} />
          <text x="179" y="142" fontSize="11" textAnchor="middle" fill={ACCENT}>
            0.759s apart
          </text>

          <text x="175" y="168" fontSize="10.5" textAnchor="middle">
            approved_at &#8804; now &#8594; false
          </text>
          <text x="175" y="184" fontSize="10" textAnchor="middle" fill={MUTED}>
            discount dropped &#183; frozen at zero forever
          </text>
        </svg>
      </div>
      <figcaption>
        both readings are of the same instant. one machine simply thinks it is
        three quarters of a second earlier than the other.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 12 - the shape of the returns. Accent is the tail, because the tail
 * is what the post is about.
 */
export function PromptCurveDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-solo diagram-wide">
        <svg
          viewBox="0 0 340 200"
          role="img"
          aria-label="How much of the vision is finished, plotted against how many prompts it took. One prompt reaches sixty percent, a few more reach eighty-five, and the curve then flattens into a long tail that takes roughly two hundred more prompts to close the last fifteen percent."
        >
          <Arrowhead id="dgm-curve" />

          <line x1="56" y1="24" x2="56" y2="156" stroke={MUTED} />
          <line
            x1="56"
            y1="156"
            x2="322"
            y2="156"
            stroke={MUTED}
            markerEnd="url(#dgm-curve)"
          />

          {/* the ceiling nobody quite reaches */}
          <line
            x1="56"
            y1="30"
            x2="306"
            y2="30"
            stroke={MUTED}
            strokeDasharray="3 4"
          />
          <text x="316" y="24" fontSize="9.5" textAnchor="end" fill={MUTED}>
            the whole vision
          </text>

          <line x1="52" y1="49" x2="56" y2="49" stroke={MUTED} />
          <line x1="52" y1="80" x2="56" y2="80" stroke={MUTED} />
          <text x="47" y="53" fontSize="9.5" textAnchor="end" fill={MUTED}>
            85%
          </text>
          <text x="47" y="84" fontSize="9.5" textAnchor="end" fill={MUTED}>
            60%
          </text>

          {/* the cheap part */}
          <path
            d="M56,156 Q62,105 76,80 Q94,60 110,49"
            fill="none"
            stroke={MUTED}
            strokeWidth="1.5"
          />
          {/* the part that costs everything */}
          <path
            d="M110,49 Q190,38 300,34"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1.5"
          />
          <circle cx="76" cy="80" r="2.5" fill={MUTED} />
          <circle cx="110" cy="49" r="2.5" fill={MUTED} />

          <text
            x="215"
            y="68"
            fontSize="10.5"
            textAnchor="middle"
            fill={ACCENT}
          >
            the last 15% &#8212; maybe 200 more
          </text>

          <line x1="76" y1="156" x2="76" y2="160" stroke={MUTED} />
          <line x1="110" y1="156" x2="110" y2="160" stroke={MUTED} />
          <line x1="300" y1="156" x2="300" y2="160" stroke={MUTED} />
          <text x="76" y="172" fontSize="9.5" textAnchor="middle" fill={MUTED}>
            1
          </text>
          <text x="110" y="172" fontSize="9.5" textAnchor="middle" fill={MUTED}>
            a few
          </text>
          <text x="300" y="172" fontSize="9.5" textAnchor="middle" fill={MUTED}>
            ~200
          </text>
          <text x="56" y="190" fontSize="9.5" fill={MUTED}>
            prompts
          </text>
        </svg>
      </div>
      <figcaption>
        the first prompt buys the most and costs the least. everything after it
        is the same curve flattening out.
      </figcaption>
    </figure>
  );
}

/**
 * Figure 13 - why one push moved the shared branch.
 * Same push, two topologies; the only difference is whether anything sits
 * between the branch and development. Accent is the fast-forward, because
 * the fast-forward is the whole incident.
 */
export function BranchFastForwardDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-row">
        <div className="diagram-panel">
          <svg
            viewBox="0 0 280 200"
            role="img"
            aria-label="The branch I was on diverged from development several commits back, so its tip and development's tip are different commits and pushing it can only ever move the branch."
          >
            <PanelHead title="the branch i was on" />

            <text x="20" y="131" fontSize="10.5" fill={MUTED}>
              development
            </text>
            <line x1="20" y1="140" x2="260" y2="140" stroke={MUTED} />
            <circle cx="60" cy="140" r="4" fill={PAPER} stroke={MUTED} />
            <circle cx="110" cy="140" r="4" fill={PAPER} stroke={MUTED} />

            <polyline
              points="110,140 152,96 245,96"
              fill="none"
              stroke={MUTED}
            />
            <circle cx="185" cy="96" r="4" fill={PAPER} stroke={MUTED} />
            <circle cx="230" cy="96" r="4" fill={PAPER} stroke={MUTED} />
            <text x="198" y="80" fontSize="10.5" textAnchor="middle">
              feature/MAAHITA-922
            </text>

            <text
              x="140"
              y="180"
              fontSize="10.5"
              textAnchor="middle"
              fill={MUTED}
            >
              diverged - a push moves only it
            </text>
          </svg>
        </div>

        <div className="diagram-panel">
          <svg
            viewBox="0 0 280 200"
            role="img"
            aria-label="The branch it made was created from development's tip with nothing in between, so its one commit is development's next commit and the push fast-forwards development onto it."
          >
            <Arrowhead id="dgm-ff" color={ACCENT} />
            <PanelHead title="the branch it made" />

            <text x="20" y="131" fontSize="10.5" fill={MUTED}>
              development
            </text>
            <line x1="20" y1="140" x2="260" y2="140" stroke={MUTED} />
            <circle cx="60" cy="140" r="4" fill={PAPER} stroke={MUTED} />
            <circle cx="110" cy="140" r="4" fill={PAPER} stroke={MUTED} />

            <line
              x1="114"
              y1="140"
              x2="162"
              y2="140"
              stroke={ACCENT}
              markerEnd="url(#dgm-ff)"
            />
            <circle cx="176" cy="140" r="4" fill={PAPER} stroke={ACCENT} />
            <text
              x="176"
              y="118"
              fontSize="10.5"
              textAnchor="middle"
              fill={ACCENT}
            >
              fix/MAAHITA-928
            </text>
            <text
              x="176"
              y="158"
              fontSize="9.5"
              textAnchor="middle"
              fill={MUTED}
            >
              3f33807f8
            </text>

            <text
              x="140"
              y="180"
              fontSize="10.5"
              textAnchor="middle"
              fill={ACCENT}
            >
              no divergence - dev comes too
            </text>
          </svg>
        </div>
      </div>
      <figcaption>
        one push, two topologies. the branch i was on had commits of its own
        between it and development, so a push could only ever move the branch.
        the branch it cut had none - so development came along with it.
      </figcaption>
    </figure>
  );
}

/** two requests carrying the same valid jwt, one with its own school id and
 *  one with another school's. authentication passes both. the membership
 *  check is the only band that tells them apart. */
export function MembershipCheckDiagram() {
  const L = 90; // own-school request
  const R = 290; // swapped-school request
  const bands = [
    { y: 48, title: "authentication", q: "is the signature valid?" },
    { y: 104, title: "membership check", q: "is this user in this school?", accent: true },
    { y: 160, title: "tenant schema", q: "repository → postgres" },
  ];

  return (
    <figure className="diagram">
      <div className="diagram-solo diagram-wide">
        <svg
          viewBox="0 0 380 226"
          role="img"
          aria-label="Two requests carry the same valid JWT. One asks for the user's own school and passes authentication, passes the membership check, and reaches the tenant schema. The other asks for another school's id: it still passes authentication, because the signature is valid either way, and is rejected at the membership check."
        >
          <Arrowhead id="dgm-membership" />

          {/* the two requests */}
          <text x={L} y="13" fontSize="10" textAnchor="middle">
            valid jwt
          </text>
          <text x={L} y="26" fontSize="10" textAnchor="middle" fill={MUTED}>
            own school id
          </text>
          <text x={R} y="13" fontSize="10" textAnchor="middle">
            same valid jwt
          </text>
          <text x={R} y="26" fontSize="10" textAnchor="middle" fill={MUTED}>
            another school&apos;s id
          </text>

          {/* the checks both requests pass through */}
          {bands.map((b) => (
            <g key={b.title}>
              <rect
                x="16"
                y={b.y}
                width="348"
                height="36"
                fill={PAPER}
                stroke={b.accent ? ACCENT : MUTED}
              />
              <text
                x="190"
                y={b.y + 15}
                fontSize="11"
                textAnchor="middle"
                fill={b.accent ? ACCENT : "currentColor"}
              >
                {b.title}
              </text>
              <text
                x="190"
                y={b.y + 29}
                fontSize="9.5"
                textAnchor="middle"
                fill={MUTED}
              >
                {b.q}
              </text>
            </g>
          ))}

          {/* own school: through every band */}
          <line
            x1={L}
            y1="34"
            x2={L}
            y2="158"
            stroke={MUTED}
            markerEnd="url(#dgm-membership)"
          />
          <text x={L + 8} y="70" fontSize="11" fill={MUTED}>
            ✓
          </text>
          <text x={L + 8} y="126" fontSize="11" fill={MUTED}>
            ✓
          </text>
          <text x={L} y="214" fontSize="9.5" textAnchor="middle" fill={MUTED}>
            reaches the school&apos;s tables
          </text>

          {/* another school's id: the signature is still fine, so
              authentication passes. the membership check stops it. */}
          <line x1={R} y1="34" x2={R} y2="122" stroke={MUTED} />
          <text x={R + 8} y="70" fontSize="11" fill={MUTED}>
            ✓
          </text>
          <line
            x1={R - 10}
            y1="122"
            x2={R + 10}
            y2="122"
            stroke={ACCENT}
            strokeWidth="2"
          />
          <text x={R + 16} y="126" fontSize="10" fill={ACCENT}>
            rejected
          </text>
        </svg>
      </div>
      <figcaption>
        two requests, one valid token. authentication passes both, because the
        signature is fine either way. the membership check is the only step
        that asks whether this user belongs in the school the url points at.
      </figcaption>
    </figure>
  );
}

export const diagrams = {
  WebhookPathDiagram,
  TwoPathsDiagram,
  ReceiptFreezeDiagram,
  LayerChainDiagram,
  SignatureCompareDiagram,
  PriceInThreePlacesDiagram,
  AdapterSeamDiagram,
  TenantIsolationDiagram,
  MigrationSplitDiagram,
  SearchMovedDiagram,
  ClockSkewDiagram,
  PromptCurveDiagram,
  BranchFastForwardDiagram,
  MembershipCheckDiagram,
};
