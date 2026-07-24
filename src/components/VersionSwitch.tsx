type VersionSwitchProps = {
  businessUrl: string;
};

export function VersionSwitch({ businessUrl }: VersionSwitchProps) {
  return (
    <div className="version-switch" role="group" aria-label="Site version">
      <a
        className="version-switch__opt"
        href={businessUrl}
        data-cursor="hover"
        data-cursor-label="Biz"
      >
        <span className="version-switch__label--full">Business</span>
        <span className="version-switch__label--short">Biz</span>
      </a>
      <span className="version-switch__opt is-active" aria-current="page">
        <span className="version-switch__label--full">Creative</span>
        <span className="version-switch__label--short">Craft</span>
      </span>
    </div>
  );
}
