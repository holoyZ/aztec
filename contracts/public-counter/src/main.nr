use dep::aztec::macros::aztec;

#[aztec]
pub contract Counter {
    use dep::aztec::macros::{functions::{external, initializer}, storage::storage};
    use dep::aztec::state_vars::PublicMutable;

    #[storage]
    struct Storage<Context> {
        value: PublicMutable<u32, Context>,
    }

    #[initializer]
    #[external("public")]
    fn constructor(initial_value: u32) {
        self.storage.value.write(initial_value);
    }

    #[external("public")]
    fn increment(by: u32) {
        let current = self.storage.value.read();
        self.storage.value.write(current + by);
    }

    #[external("public")]
    fn get_value() -> pub u32 {
        self.storage.value.read()
    }
}
